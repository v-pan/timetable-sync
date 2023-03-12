import { backendFetch, backendRequest, Message } from "./message";
import { IdentityResponse, ViewOptionsResponse, EventResponse } from "./scientia/responses";

const CUSTOM_DIV_ID = "custom-toolbar-button-322d51ce";
let intervalId: number | undefined = undefined;
let hasAuth: boolean = false;

browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message);
    const syncButton = document.getElementById(CUSTOM_DIV_ID);

    // if(message.type === "auth"){
    //     switch (message.body.status) {
    //         case "auth_finished":
    //             hasAuth = true;
                
    //             if (syncButton) {
    //                 syncButton.hidden = false;
    //             }
                
    //             break;
    //         case "auth_revoked":
    //             hasAuth = false;
                
    //             if (syncButton) {
    //                 syncButton.hidden = true;
    //             }

    //             break;
    //     }
    // }
});

const onSync = async (e: MouseEvent, src: HTMLButtonElement) => {
    // if (!hasAuth) {
    //     alert("Not authorised, please authorise from the extension icon.")
    //     return;
    // }

    // const json = await backendRequest({resource: "calendarList", method: "list", params: {"maxResults": 1, "minAccessRole": "freeBusyReader"}});

    // Auth token to allow us to authenticate as the user
    const scientiaAuthToken = JSON.parse(window.localStorage.getItem("scientia-session-authorization") != null ? window.localStorage.getItem("scientia-session-authorization")!! : "")?.access_token;
    
    let userEndpoint: string | undefined = undefined;
    let viewOptionsEndpoint: string | undefined = undefined;
    let filterEndpoint: string | undefined = undefined;

    // Gather all endpoints from previous network requests
    performance.getEntries().forEach(entry => {
        if (entry.name.endsWith("UserProfile")){
            userEndpoint = entry.name;
        } else if (entry.name.includes("ViewOptions")) {
            viewOptionsEndpoint = entry.name;
        } else if (entry.name.includes("FilterIncludePersonalAndBookings")) {
            filterEndpoint = entry.name;
        }
    });

    console.log("User endpoint:", userEndpoint);
    console.log("ViewOptions endpoint:", viewOptionsEndpoint);
    console.log("Filter endpoint:", filterEndpoint);

    // Copy the timetable's flow
    // TODO: Check that the scientia auth token hasn't expired.
    // TODO: Clean this up with messaging
    if (userEndpoint && viewOptionsEndpoint && filterEndpoint) {
        // Get personal identity from userEndpoint
        const identityRes = await backendFetch(userEndpoint, { method: "GET", headers: { "Authorization": `Bearer ${scientiaAuthToken}` } });
        const identityJson = identityRes as IdentityResponse;

        console.log("Identity:", identityJson);

        // Get view options
        const viewOptionsRes = await backendFetch(viewOptionsEndpoint, { method: "GET", headers: { "Authorization": `Bearer ${scientiaAuthToken}` }});
        const viewOptionsJson = viewOptionsRes as ViewOptionsResponse;

        console.log("ViewOptions", viewOptionsJson);

        // Choose a DatePeriods
        let datePeriod = viewOptionsJson.DatePeriods.find(entry => entry.Description === "All Year")!!;
        // Add weeks property to chosen DatePeriods
        (datePeriod as any).Weeks = viewOptionsJson.Weeks.map((week) => {
            (week as any).HasCustomLabel = false;
            return week;
        });

        // Choose all Day objects from Days
        const days = viewOptionsJson.Days;

        // Choose TimePeriod object from TimePeriods
        const timePeriod = viewOptionsJson.TimePeriods.find(entry => entry.Description === "All Day")!!;

        // Make request for all events
        const requestBody = {
            CategoryTypesWithIdentities: [],
            FetchBookings: false,
            FetchPersonalEvents: true,
            PersonalIdentities: identityJson.ResourceIdentities,
            ViewOptions: {
                DatePeriods: [datePeriod],
                Days: days,
                TimePeriods: [timePeriod],
                Weeks: []
            }
        };

        console.log("Body:", JSON.stringify(requestBody));

        const eventsRes = await backendFetch(filterEndpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${scientiaAuthToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const eventsJson = eventsRes as EventResponse;
        console.log("Events:", eventsJson); // TODO: Fix "parameter cannot be null; source"
    }
    // console.log(json);
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

    const buttonHtml = `<div id="${CUSTOM_DIV_ID}" hidden="true" class="toolbar-item-content e-tbar-btn e-tbtn-txt e-control e-btn e-lib" style="">
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