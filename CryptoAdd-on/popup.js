/*
This Popup handles the input of the password, and two buttons: encrypt and cancel.
*/
console.log("Popup.js is loaded.")
var password;

window.addEventListener("load", onLoad);
//this is loaded, each time the Insecure button is clicked.

async function notifyMode(event) {


    //this works, why can't I send it to background??
    //var password = await document.getElementById("password_input").value;
    console.log("6. This gets the password " + password);

    //Ah! this is the data (encrypt or cancel!)
    console.log("7. An 'encrypt' or 'Cancel' has pressed: " + event.target.getAttribute("data"));
    await messenger.runtime.sendMessage({ popupCloseMode: event.target.getAttribute("data") });
    
    //await - waits for a promise to fulfill
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);

}

async function updatePassword() {
    password = document.getElementById("password_input").value;
    //this should be an object Promise?
    await password;
    console.log("is this a promise? " + password);
}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    document.getElementById("password_input").addEventListener("blur", updatePassword);
    //the page is loaded, on the "insecure" click.
    console.log("5. popup.js onLoad is activated.");
}



