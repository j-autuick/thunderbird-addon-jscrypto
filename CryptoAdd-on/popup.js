window.addEventListener("load", onLoad);
//this is loaded, each time the Insecure button is clicked.

async function notifyMode(event) {


    //this works, why can't I send it to background??
    var password = await document.getElementById("password_ok").value;
    console.log("6. This gets the password " + password);

    //Ah! this is the data (encrypt or cancel!)
    console.log("7. An Ok/Encrypt or Cancel is pressed: " + event.target.getAttribute("data"));
    await messenger.runtime.sendMessage({ popupCloseMode: event.target.getAttribute("data") });

    //await - waits for a promise to fulfill
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    //the page is loaded, on the "insecure" click.
    console.log("5. Ok, the popup.js is loaded.");
}

