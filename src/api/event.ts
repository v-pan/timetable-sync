import { request } from "./api";
import { Event, InsertBody, InsertParams } from "./types/event";

/**
 * Creates an event.
 * @param accessToken OAuth access token
 * @param body Request body
 * @param params Query parameters
 */
export const insert = async (accessToken: string, params: InsertParams, body: InsertBody) => {
    // TODO: Split path and query parameters
    const calendarId = params.calendarId;
    let requestParams: any = params;
    requestParams.calendarId = undefined;
    console.log("cut parameters", requestParams);
    const res = await request(accessToken, `/calendars/${calendarId}/events`, params, body);

    if (res.ok){
        const event = (await res.json()) as Event;
        console.log("Created event:", event);
        return event;
    } else {
        console.error(res.statusText);
    }
}