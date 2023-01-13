import { Message, sendToFrontend } from "../message";
import { getAccessToken } from "./authorise";

browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    if (message.type == "auth_start") {
        const accessToken = await getAccessToken();
        const responses = await sendToFrontend({ type: "auth_finished", token: accessToken });
        console.log("Responses:", responses);
    }
});