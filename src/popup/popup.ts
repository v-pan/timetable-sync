import { backendRequest, sendToBackend } from "../message";
import { CalendarList, CalendarListEntry } from "../api/types/calendarList";

const authButton = document.getElementById("authorize_button");
const signOutButton = document.getElementById("signout_button");
const contentDiv = document.getElementById("content");
const debug = document.getElementById("debug");

let hasAuth: boolean = false;

const selectCalendar = async (calendar: CalendarListEntry) => {
    // TODO: Verify the user has writer | owner permissions to the selected calendar. Show an error if not
    // await sendToBackend({type: "calendar_select", body: { listEntry: calendar }});

}

const showCalendarList = async () => {
    // TODO: See if this can be done as a direct request from the popup instead of passing it to the backend.
    const calendarList = (await backendRequest({ resource: "calendarList", method: "list" })) as CalendarList;
    debug!!.innerHTML = JSON.stringify(calendarList);

    const title = contentDiv!!.getElementsByClassName("title")[0];
    title!!.innerHTML = "Select the calendar you'd like to sync to:";

    const list = contentDiv!!.getElementsByClassName("list")[0];
    calendarList.items.forEach(entry => {
        const listItem = document.createElement("li");
        const anchor = document.createElement("a");

        anchor!!.innerHTML = entry.summary;
        anchor.addEventListener("click", () => selectCalendar(entry));
        
        listItem.appendChild(anchor);
        list!!.appendChild(listItem);
    });
    
    contentDiv!!.hidden = false;
}

authButton?.addEventListener("click", async (ev: MouseEvent) => {
    authButton!!.hidden = true;
    signOutButton!!.hidden = false;

    await sendToBackend({type: "auth", body: { status: "auth_start" }});

    showCalendarList();
});

signOutButton?.addEventListener("click", async () => {
    await sendToBackend({ type: "auth", body: { status: "auth_revoked" }});
})

// Turns out this never runs:
// 
// browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
//     if (message.type === "auth") {
//         switch (message.body.status) {
//             case "auth_finished":
//                 hasAuth = true;

//                 authButton!!.hidden = true;
//                 signOutButton!!.hidden = false;

//                 accessToken = message.body.token;
//                 debug!!.innerHTML = accessToken;

//                 showCalendarList();
//             case "auth_revoked":
//                 authButton!!.hidden = false;
//                 signOutButton!!.hidden = true;

//                 hasAuth = false;
//         }
        
//     }
// });