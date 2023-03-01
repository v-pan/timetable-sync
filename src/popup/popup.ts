import { AuthBody, Message, sendToBackend } from "../message";

const authButton = document.getElementById("authorize_button");
const signOutButton = document.getElementById("signout_button");

let hasAuth: boolean = false;

authButton?.addEventListener("click", async (ev: MouseEvent) => {
    authButton!!.hidden = true;
    signOutButton!!.hidden = false;

    await sendToBackend({type: "auth", body: { status: "auth_start" }});
});

signOutButton?.addEventListener("click", async () => {
    await sendToBackend({ type: "auth", body: { status: "auth_revoked" }});
})

browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message receieved:", message)
    if (message.type === "auth") {
        switch (message.body.status) {
            case "auth_finished":
                hasAuth = true;
                
                authButton!!.hidden = true;
                signOutButton!!.hidden = false;
            case "auth_revoked":
                authButton!!.hidden = false;
                signOutButton!!.hidden = true;

                hasAuth = false;
        }
        
    }
});