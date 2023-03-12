import { CalendarListEntry, ListParams } from "./api/types/calendarList";
import { InsertBody, InsertParams } from "./api/types/event";

export const sendToBackend = async (message: Message, options?: browser.runtime._SendMessageOptions) => {
    await browser.runtime.sendMessage(message, options);
}

/**
 * 
 * @param message Message to send to active frontend tabs
 * @param options Options to send with message
 * @returns A map of tab IDs to the response from that ID
 */
export const sendToFrontend = async (message: Message, options?: browser.tabs._SendMessageOptions) => {
    const activeTabs = await browser.tabs.query({currentWindow: true, active: true});
    const responses = new Map();
    for (const tab of activeTabs) {
        if (tab.id == undefined) continue;
        
        const response = await browser.tabs.sendMessage(tab.id, message, options);
        if (response != undefined) {
            responses.set(tab.id, response);
        }
    }

    return responses;
}

export const backendRequest = (request: APIRequest) => {
    const port = browser.runtime.connect();

    let promise = new Promise((resolve, _) => {
        const callback = response => resolve(response);

        port.onMessage.addListener(callback);
    });

    // Send the request to the backend
    port.postMessage({ type: "request", body: request });

    return promise;
}

export const backendFetch = async (url: string | URL, options?: RequestInit) => {
    console.log("Fetching...")
    const port = browser.runtime.connect();

    let promise = new Promise((resolve, _) => {
        const callback = response => resolve(response);

        port.onMessage.addListener(callback);
    });

    // Send the request to the backend
    port.postMessage({ type: "fetch", url, options });

    return promise;
}

export type Message = { type: "auth", body: AuthBody } | { type: "request", body: APIRequest } | { type: "calendar_select", body: { listEntry: CalendarListEntry }} | { type: "fetch", url: string | URL, options?: RequestInit }

export type AuthBody = 
{ status: "auth_finished" } |
{ status: "auth_start" } | 
{ status: "auth_revoked" }

export type APIRequest = { resource: "calendarList", method: "list", params?: ListParams } |
{ resource: "event", method: "insert", params: InsertParams, body: InsertBody }