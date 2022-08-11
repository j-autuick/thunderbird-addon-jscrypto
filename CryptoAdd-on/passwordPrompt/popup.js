

window.addEventListener("load", onLoad);
//this is loaded, each time the Insecure button is clicked.


async function notifyMode(event) {
    let randomText = "Lorem ipsum dolor sit amet, consectetur \
    adipiscing elit. Pellentesque et dui vel nibh finibus \
    sagittis. Quisque ut justo at lacus laoreet ultricies. \
    Curabitur tincidunt a augue at laoreet. Vivamus placerat \
    et lacus a ornare. Aenean libero tellus, iaculis et nisl id, \
    consectetur efficitur nisi. Ut commodo diam lacus, eget \
    convallis dolor consectetur non. Fusce efficitur elit ex, \
    eu sollicitudin ante iaculis non. Duis viverra, nisl nec \
    egestas tincidunt, risus nibh vulputate lectus, quis \
    malesuada urna nibh ac lectus. Ut ligula nibh, mollis \
    sed luctus non, varius ac ante. Quisque non enim nec \
    odio ullamcorper condimentum."

    await messenger.runtime.sendMessage({ popupCloseMode: event.target.getAttribute("data") });
    let password = await document.getElementById("password_ok").value;
    let win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
    
    console.log("password entered is: " + password)
    console.log(randomText);

    //above all works, now just this part
    console.log(sjcl.encrypt(password, randomText));
}

async function onLoad() {
   document.getElementById("button_ok").addEventListener("click", notifyMode);
   document.getElementById("button_cancel").addEventListener("click", notifyMode);
}