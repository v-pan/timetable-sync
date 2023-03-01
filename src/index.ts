// document.body.style.border = "5px solid red";

import { Message, Request, sendToBackend } from "./message";

const CUSTOM_DIV_ID = "custom-toolbar-button-322d51ce";
let intervalId: number | undefined = undefined;
let accessToken: string | undefined = undefined; // TODO: Remove accessToken from frontend

// import { v4 as generateUUID } from "uuid";

// const requests: { [messageId: string]: {event_listener: EventListener} } = {}
// const queueRequest = (fn: () => any) => {
//     return Promise.resolve().then(fn);
// };

// const request = async (message: Request) => {
//     const message_id = generateUUID();

//     const promise: Promise<any> = new Promise((resolve, reject) => {
//         let event_listener = ((response: CustomEvent) => {
//             // Clean up event listener
//             document.removeEventListener(message_id, requests[message_id].event_listener)
//             delete requests[message_id]

//             // Return the response
//             const result = response.detail.inner as any
//             resolve(result);
//         }) as EventListener

//         requests[message_id] = { event_listener: event_listener }

//         document.addEventListener(message_id, event_listener)
//     });

//     return queueRequest(async () => {
//         await sendToBackend({type: "request", id: message_id, body: message});
//         return await promise;
//     })
// }

import { v4 as generateUUID } from "uuid";
const requests: { [messageId: string]: {event_listener: EventListener} } = {}

const makeRequest = (request: Request) => {
    const port = browser.runtime.connect();

    const message_id = generateUUID();

    let queue = (fn: () => Promise<any>) => {
        return Promise.resolve().then(fn);
    };    

    const callback = response => {
        console.log("Received response", response);

        // Broadcast the result.
        // Maybe can replace this with a closure over a variable? Don't know how to tell when the result arrives though.
        document.dispatchEvent(
            new CustomEvent(message_id, { detail: response })
        );
    }

    port.onMessage.addListener(callback);

    // Send the request to the backend
    port.postMessage(request);

    // Wait to see the result broadcast on the document
    const promise: Promise<any> = new Promise((resolve, reject) => {
        let event_listener = ((response: CustomEvent) => {
            // Clean up event listener
            document.removeEventListener(message_id, requests[message_id].event_listener)
            delete requests[message_id]

            // Close the port for this message
            port.disconnect();

            // Return the response from the parent promise
            const result = response.detail as any
            resolve(result);
        }) as EventListener

        // Add and keep track of the event listener for this message
        requests[message_id] = { event_listener: event_listener }
        document.addEventListener(message_id, event_listener)
    });

    return promise;
}

browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    if (message.type == "auth_finished") {
        accessToken = message.accessToken;
    }
});

const onSync = async (e: MouseEvent, src: HTMLButtonElement) => {
    if (accessToken == undefined) {
        alert("Not authorised, please authorise from the extension icon.")
    } else {
        const json = await makeRequest({resource: "calendarList", method: "list", params: {"maxResults": 1, "minAccessRole": "freeBusyReader"}});

        console.log(json);
    }
}

const findRightToolbar = () => {
    try {
        const schedulerToolbar = document.getElementsByClassName("scheduler-container")[0].getElementsByClassName("e-schedule-toolbar")[0]; // Second schedule toolbar
        // console.log("Found toolbar:", schedulerToolbar);
        const rightToolbar = schedulerToolbar.getElementsByClassName("e-toolbar-right")[0];

        return rightToolbar

    } catch (e) {

        return undefined
    }
}

const createSyncButton = () => {
    if (document.getElementById(CUSTOM_DIV_ID) != undefined) {
        clearInterval(intervalId);
        return;
    }

    const doc = document;

    const buttonHtml = `<div id="${CUSTOM_DIV_ID}" class="toolbar-item-content e-tbar-btn e-tbtn-txt e-control e-btn e-lib" style="">
    <button class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib" type="button" id="e-tbr-btn_5" style="width: auto;" tabindex="-1" aria-label="Sync to Calendar">
        <span class="e-tbar-btn-text">Sync to Calendar</span>
    </button>
    </div>`;

    const dummyDiv = doc.createElement("div");
    dummyDiv.innerHTML = buttonHtml;
    const customButton = dummyDiv.firstChild as HTMLButtonElement;
    customButton.addEventListener("click", (e: MouseEvent) => onSync(e, customButton));

    // console.log("Created custom button:", customButton);

    const rightToolbar = findRightToolbar()!!;

    // console.log("Found right side of toolbar:", rightToolbar);
    rightToolbar.appendChild(customButton);
    clearInterval(intervalId);
}

// Check that toolbar exists
intervalId = setInterval(() => {
    const toolbar = findRightToolbar();
    if (toolbar != undefined) {
        createSyncButton();
    }
}, 500);