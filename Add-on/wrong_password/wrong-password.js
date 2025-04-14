document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("tryAgain").addEventListener("click", async () => {
      let win = await messenger.windows.getCurrent();
      await messenger.windows.remove(win.id);
      messenger.runtime.sendMessage({ retryDecryption: true });
    });
  
    document.getElementById("cancel").addEventListener("click", async () => {
      let win = await messenger.windows.getCurrent();
      await messenger.windows.remove(win.id);
      messenger.runtime.sendMessage({ retryDecryption: false });
    });
  });
  