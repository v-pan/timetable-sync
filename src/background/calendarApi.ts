/**
 * Tools to build Google Calendar API calls
 * 
 * Playground tool at https://developers.google.com/oauthplayground/
 */

const REQUEST_BASE_URL = "https://www.googleapis.com/calendar/v3/";

const buildRequest = (accessToken: string, options: RequestInit = {}) => {

    const requestUrl = REQUEST_BASE_URL; // TODO: Build appropriate request url from func params

    const requestHeaders = new Headers();
    requestHeaders.append("Authorization", `Bearer ${accessToken}`);

    options.headers = requestHeaders;

    const request = new Request(requestUrl, options);

    return request;
}

const request = async (accessToken: string, options?: RequestInit) => {
    const request = buildRequest(accessToken, options)

    return fetch(request)
}