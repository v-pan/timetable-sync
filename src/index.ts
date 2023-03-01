// document.body.style.border = "5px solid red";

import { Message, APIRequest, sendToBackend } from "./message";

const CUSTOM_DIV_ID = "custom-toolbar-button-322d51ce";
let intervalId: number | undefined = undefined;
let hasAuth: boolean = false;

const makeRequest = (request: APIRequest) => {
    const port = browser.runtime.connect();

    let promise = new Promise((resolve, _) => {
        const callback = response => resolve(response);

        port.onMessage.addListener(callback);
    });

    // Send the request to the backend
    port.postMessage(request);

    return promise;
}

browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    if (message.type == "auth_finished") {
        
    }
});

const onSync = async (e: MouseEvent, src: HTMLButtonElement) => {
    if (!hasAuth) {
        alert("Not authorised, please authorise from the extension icon.")
        return;
    }

    const json = await makeRequest({resource: "calendarList", method: "list", params: {"maxResults": 1, "minAccessRole": "freeBusyReader"}});

    console.log(json);
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