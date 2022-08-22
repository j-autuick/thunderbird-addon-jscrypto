/*
This Popup handles the input of the password, and two buttons: encrypt and cancel.
*/
console.log("7. Popup.js is loaded.")

window.addEventListener("load", onLoad);
//this is loaded, each time the Insecure button is clicked.

async function notifyMode(event) {


    //this works, why can't I send it to background??
    var password = await document.getElementById("password_input").value;
    console.log("9. This gets the password " + password);
    console.log("9.1 " + password);
    await messenger.runtime.sendMessage({ popupCloseMode: password })

    //Ah! this send the data to the popupCloseMode function
    
    //ok password works with above...but then this breaks, so need 2!
    console.log("10. An 'encrypt' or 'Cancel' has pressed: " + event.target.getAttribute("data"));
    await messenger.runtime.sendMessage({ popupCloseMode: event.target.getAttribute("data") });
    
    //await - waits for a promise to fulfill
    //ok this breaks!
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);

}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    document.getElementById("password_input").addEventListener("blur", notifyMode);
    //the page is loaded, on the "insecure" click.
    console.log("8. popup.js has been actived by 'onLoad'.");
}



