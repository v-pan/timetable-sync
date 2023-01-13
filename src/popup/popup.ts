import { sendToBackend } from "../message";

// browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
//     console.log("Message get")
//     browser.notifications.create({
//         type: "basic",
//         title: "Message received",
//         message: "Test"
//     });

//     sendResponse("Ayyy");
// });
// console.log("Listener created");

const authButton = document.getElementById("authorize_button");
authButton?.addEventListener("click", async (ev: MouseEvent) => {
    console.log("Requesting...");
    await sendToBackend({type: "auth_start"})
});