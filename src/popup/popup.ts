import { getAccessToken } from "./authorise";

const authButton = document.getElementById("authorize_button");
authButton?.addEventListener("click", async (ev: MouseEvent) => {
    console.log("Requesting...");
    const accessToken = await getAccessToken();
    
})