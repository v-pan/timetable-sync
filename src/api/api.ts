/**
 * Tools to build Google Calendar API calls
 * 
 * Playground tool at https://developers.google.com/oauthplayground/
 */

const REQUEST_BASE_URL = "https://www.googleapis.com/calendar/v3";

export const request = async (accessToken: string, relativeUrl: string, params?: any, body?: any, options: RequestInit = {}) => {
    if (relativeUrl.startsWith("/")) {
        relativeUrl = relativeUrl.slice(1);
    }

    const requestUrl = new URL(`${REQUEST_BASE_URL}/${relativeUrl}`);

    // Append request parameters
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            switch (typeof(value)) {
                case "number":
                    requestUrl.searchParams.append(key, value.toString());
                    break;
                case "string":
                    requestUrl.searchParams.append(key, value);
                    break;
                case "undefined":
                    break;
                default:
                    throw Error("Type not serialisable");
            }
        });
    }

    const requestHeaders = new Headers(options.headers);

    if (body) {
        requestHeaders.append("Content-Type", "application/json");
        options.method = "POST"
        options.body = JSON.stringify(body);
    }

    // Append access token to request header
    requestHeaders.append("Authorization", `Bearer ${accessToken}`);
    options.headers = requestHeaders;

    const request = new Request(requestUrl, options);
    return fetch(request);
}