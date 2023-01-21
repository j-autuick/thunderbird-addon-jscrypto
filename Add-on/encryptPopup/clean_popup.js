window.addEventListener("load", onLoad);

async function notifyMode(event) {

    var password = await document.getElementById("password_input").value;

    await messenger.runtime.sendMessage({ closingEncryptionPopup: password });
    await messenger.runtime.sendMessage({ closingEncryptionPopup: event.target.getAttribute("data") });
    
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);

}

async function onLoad() {
    document.getElementById("button_ok").addEventListener("click", notifyMode);
    document.getElementById("button_cancel").addEventListener("click", notifyMode);
    document.getElementById("password_input").addEventListener("blur", notifyMode);
  
}



