window.addEventListener("load", onLoad);

async function notifyMode(event) {
    const passwordInput = document.getElementById("password_input");
    const password = passwordInput.value;

    // Notify background with password
    await messenger.runtime.sendMessage({ closingDecryptionPopup: password });

    // Close the popup window
    const win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
}

async function cancelPopup() {
    // Notify background with cancel status
    await messenger.runtime.sendMessage({ closingDecryptionPopup: "cancel" });

    // Close the popup window
    const win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
}

async function onLoad() {
    const input = document.getElementById("password_input");
    const decryptBtn = document.getElementById("button_decrypt");
    const cancelBtn = document.getElementById("button_cancel");

    decryptBtn.addEventListener("click", notifyMode);
    cancelBtn.addEventListener("click", cancelPopup);

    // Set focus on the input field
    input.focus();

    // Handle Enter key to trigger the Decrypt button
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            decryptBtn.click();
        }
    });
}
