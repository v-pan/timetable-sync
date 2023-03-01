/**
 * Tools to build Google Calendar API calls
 * 
 * Playground tool at https://developers.google.com/oauthplayground/
 */

const REQUEST_BASE_URL = "https://www.googleapis.com/calendar/v3";

export const request = async (accessToken: string, relativeUrl: string, params?: any, options: RequestInit = {}) => {
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
                default:
                    throw Error("Type not serialisable");
            }
        });
    }

    // Append access token to request header
    const requestHeaders = new Headers(options.headers);
    requestHeaders.append("Authorization", `Bearer ${accessToken}`);
    // requestHeaders.append("Access-Control-Allow-Origin", "*");
    options.headers = requestHeaders;

    const request = new Request(requestUrl, options);

    return fetch(request)
}