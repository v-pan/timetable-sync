// document.body.style.border = "5px solid red";

/**
 * 
 * @param {MouseEvent} e 
 */
const onSync = (e) => {
    
}

// TODO: Poll until the elements we want to change exist
setTimeout(() => {
    /**
     * @type Document
     */
    const doc = document

    const buttonHtml = `<div id="toolbar-item-lanes-mode" class="toolbar-item-content e-tbar-btn e-tbtn-txt e-control e-btn e-lib" style="">
    <button class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib" type="button" id="e-tbr-btn_5" style="width: auto;" tabindex="-1" aria-label="Sync to Calendar">
        <span class="e-tbar-btn-text">Sync to Calendar</span>
    </button>
    </div>`;

    let customButton = doc.createElement("div");
    customButton.innerHTML = buttonHtml;
    customButton = customButton.firstChild;
    customButton.firstChild.addEventListener("click", (e) => onSync(e))

    console.log("Created custom button:", customButton);

    const schedulerToolbar = doc.getElementsByClassName("scheduler-container")[0].getElementsByClassName("e-schedule-toolbar")[0]; // Second schedule toolbar
    console.log("Found toolbar:", schedulerToolbar);
    const rightToolbar = schedulerToolbar.getElementsByClassName("e-toolbar-right")[0];

    console.log("Found right side of toolbar:", rightToolbar);
    rightToolbar.appendChild(customButton);
}, 5000);


// document.addEventListener('DOMContentLoaded', () => {
//     console.log("Page loaded.")
    // const monthDiv = document.getElementsByClassName("e-month")[0];
    // console.log(monthDiv);
    // const monthButton = monthDiv.querySelector("button");
    // console.log(monthButton);
    // monthButton.click();
// });


        