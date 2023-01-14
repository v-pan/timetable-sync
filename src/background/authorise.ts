// Flow taken from https://github.com/mdn/webextensions-examples/blob/main/google-userinfo/background/authorize.js

import { CLIENT_ID, API_KEY } from "../../secrets/keys";
const SCOPES = [
    // "calendar.app.created",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly"
];
const REDIRECT_URL = browser.identity.getRedirectURL();
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;
const VALIDATION_BASE_URL="https://www.googleapis.com/oauth2/v3/tokeninfo";

const extractAccessToken = (redirectUri: string) => {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1)
      return null;
    let params = new URLSearchParams(m[1].split("#")[0]);
    return params.get("access_token");
}

/**
 * - Make a GET request to the validation URL, including the access token
 * - If the response is 200, and contains an "aud" property, and that property
 *   matches the clientID, then the response is valid
 * - Otherwise it is not valid
 */
const validate = async (redirectUrl: string) => {
    const accessToken = extractAccessToken(redirectUrl);
    if (accessToken == null) {
        throw new Error("Failed to authorize");
    }
    const validationUrl = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;

    const valid = await fetch(validationUrl, {
        method: "GET"
    })

    if (valid.status != 200) {
        throw new Error("Failed to validate token");
    } else {
        const json = await valid.json();
        if (json.aud && (json.aud === CLIENT_ID)) {
            return accessToken;
        } else {
            throw new Error("Failed to validate token");
        }
    }
}

const authorise = async () => {
    return browser.identity.launchWebAuthFlow({
        interactive: true,
        url: AUTH_URL
    })
}

export const getAccessToken = async () => {
    const redirectUrl = await authorise();
    return validate(redirectUrl);
}