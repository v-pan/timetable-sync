import { request } from "./api";
import { CalendarList, ListParams } from "./types/calendarList";

/**
 * Returns the calendars on the user's calendar list.
 * @param accessToken OAuth access token
 * @param params Query parameters
 */
export const list = async (accessToken: string, params?: ListParams): Promise<CalendarList> => {
    const res = await request(accessToken, "/users/me/calendarList", params)
    console.log("Response:", res);
    return await res.json();
}