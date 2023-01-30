/*
This Popup handles the input of the password, and two buttons: encrypt and cancel.
*/
// console.log("7. Popup.js is loaded.")

window.addEventListener("load", onLoad);
//this is loaded, each time the Insecure button is clicked.

async function notifyMode(event) {

    //await messenger.runtime.sendMessage({ getPassword: "hi"});

    //this works, why can't I send it to background??
    var password = await document.getElementById("password_input").value;
    console.log("9. This gets the password " + password);
    console.log("9.1 - which is: " + password);
    console.log("checking sending of password: " + {closingEncryptionPopup: password});
    await messenger.runtime.sendMessage({ closingEncryptionPopup: password });

    //Ah! this send the data to the closingEncryptionPopup function
    await messenger.runtime.sendMessage({ closingEncryptionPopup: event.target.getAttribute("data") });
    
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);

}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    document.getElementById("password_input").addEventListener("blur", notifyMode);
}
