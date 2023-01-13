// document.body.style.border = "5px solid red";

import { Message } from "./message";

let intervalId: number | undefined = undefined;
let accessToken: string | undefined = undefined;

browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    if (message.type == "auth_finished") {
        accessToken = message.token;
    }
});

const onSync = async (e: MouseEvent) => {
}

const findRightToolbar = () => {
    const schedulerToolbar = document.getElementsByClassName("scheduler-container")[0].getElementsByClassName("e-schedule-toolbar")[0]; // Second schedule toolbar
    console.log("Found toolbar:", schedulerToolbar);
    const rightToolbar = schedulerToolbar.getElementsByClassName("e-toolbar-right")[0];

    return rightToolbar
}

const createSyncButton = () => {
    if (document.getElementById("custom-toolbar-button-322d51ce") != undefined) {
        clearInterval(intervalId);
        return;
    }

    const doc = document;

    const buttonHtml = `<div id="custom-toolbar-button-322d51ce" class="toolbar-item-content e-tbar-btn e-tbtn-txt e-control e-btn e-lib" style="">
    <button class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib" type="button" id="e-tbr-btn_5" style="width: auto;" tabindex="-1" aria-label="Sync to Calendar">
        <span class="e-tbar-btn-text">Sync to Calendar</span>
    </button>
    </div>`;

    const dummyDiv = doc.createElement("div");
    dummyDiv.innerHTML = buttonHtml;
    const customButton = dummyDiv.firstChild as any;
    customButton.addEventListener("click", (e) => onSync(e))

    console.log("Created custom button:", customButton);

    const rightToolbar = findRightToolbar();

    console.log("Found right side of toolbar:", rightToolbar);
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