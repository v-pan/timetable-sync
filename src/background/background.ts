import { list } from "../api/calendarList";
import { Message, APIRequest, sendToFrontend } from "../message";
import { getAccessToken } from "./authorise";

let accessToken: string | undefined = undefined;

const respondToMessage = (message_id: string, response: any) => {
    document.dispatchEvent(
        new CustomEvent(message_id, { detail: response })
    );
}

browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    switch (message.type) {
        case "auth_start":
            accessToken = await getAccessToken();
            const responses = await sendToFrontend({ type: "auth_finished" });
            console.log("Responses:", responses);
            break;
    }
});

browser.runtime.onConnect.addListener(async port => {
    port.onMessage.addListener(async res => {
        const message = res as APIRequest;
        if (accessToken) {
            switch  (message.resource) {
                case "calendarList":
                    switch (message.method) {
                        case "list":
                            console.log(accessToken);
                            const json = await list(accessToken);
                            console.log("JSON:", json);
                            port.postMessage(json);
                            break;
                    }
            }
        }
    })
})