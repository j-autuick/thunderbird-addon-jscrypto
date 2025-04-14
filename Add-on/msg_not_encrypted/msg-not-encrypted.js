document.addEventListener("DOMContentLoaded", () => {
    const okButton = document.getElementById("button_ok");

    okButton.addEventListener("click", async () => {
        const win = await messenger.windows.getCurrent();
        messenger.windows.remove(win.id);
    });
});
