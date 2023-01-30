/*
This Popup handles the input of the password, and two buttons: encrypt and cancel.
*/
// console.log("7. Popup.js is loaded.")

window.addEventListener("load", onLoad);
//this is loaded, each time the Insecure button is clicked.

async function notifyMode(event) {

    //this works, why can't I send it to background??
    {
        var password = await document.getElementById("password_input").value;
        console.log("9. This gets the password " + password);
        console.log("9.1 - which is: " + password);
    }
    //this is wrong or useless, but why?
    console.log("checking sending of password: " + {closingDecryptionPopup: password});
    await messenger.runtime.sendMessage({ closingDecryptionPopup: password });

    await messenger.runtime.sendMessage({ closingDecryptionPopup: event.target.getAttribute("data") });
    
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);

}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    document.getElementById("password_input").addEventListener("blur", notifyMode);
    //the page is loaded, on the "insecure" click.
    // console.log("8. (popup.js) onLoad listeners are loaded.")
}



