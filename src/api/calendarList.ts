import { request } from "./api";
import { ListParams } from "./types/calendarList";

/**
 * Returns the calendars on the user's calendar list.
 * @param accessToken User's access token
 */
export const list = async (accessToken: string, params?: ListParams) => {
    const res = await request(accessToken, "/users/me/calendarList", params)
    console.log("Response:", res);
    return await res.json();
}