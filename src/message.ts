import { ListParams } from "./api/types/calendarList";

export const sendToBackend = async (message: Message, options?: browser.runtime._SendMessageOptions) => {
    const response = await browser.runtime.sendMessage(message, options);
    return response;
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

export type Message = 
{ type: "auth_finished" } |
{ type: "auth_start" }

export type APIRequest = {resource: "calendarList", method: "list", params?: ListParams}