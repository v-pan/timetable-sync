import * as calendarList from "../api/calendarList";
import * as event from "../api/event";
import { sendToFrontend, Message } from "../message";
import { getAccessToken } from "./authorise";

let accessToken: string | undefined = undefined;

browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    if (message.type === "auth") {
        switch (message.body.status) {
            case "auth_start":
                if (accessToken == undefined) {
                    accessToken = await getAccessToken();
                }

                await sendToFrontend({ type: "auth", body: { status: "auth_finished" }});
                break;
            case "auth_revoked":
                accessToken = undefined;
                
                // TODO: Actually revoke the token

                await sendToFrontend({ type: "auth", body: { status: "auth_revoked" }});

        }
    }
});

browser.runtime.onConnect.addListener(async port => {
    port.onMessage.addListener(async res => {
        let message = res as Message;

        if (accessToken && message.type === "request") {
            switch  (message.body.resource) {
                case "calendarList":
                    switch (message.body.method) {
                        case "list":
                            console.log(accessToken);
                            const json = await calendarList.list(accessToken);
                            console.log("JSON:", json);
                            port.postMessage(json);
                            break;
                    }
                    break;
                case "event":
                    switch (message.body.method) {
                        case "insert":
                            console.log("inserting", message.body);
                            const json = await event.insert(accessToken, message.body.params, message.body.body);
                            console.log("JSON:", json);
                            port.postMessage(json as any);
                            break;
                    }
                    break;
            }
        }
    })
})