console.log("background.js loaded.");

// Function to open a popup and await user feedback
async function blockingPopup() {
	async function popupClosePromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			//window does not exist, assume closed
			return defaultPopupCloseMode;
		}
		return new Promise(resolve => {
			let popupCloseMode = defaultPopupCloseMode;
			function windowRemoveListener(closedId) {
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					resolve(popupCloseMode);
				}
			}
			function messageListener(request, sender, sendResponse) {
				if (sender.tab.windowId == popupId && request && request.popupCloseMode) {
					popupCloseMode = request.popupCloseMode;
				}
			}
			messenger.runtime.onMessage.addListener(messageListener);
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}

	let window = await messenger.windows.create({
		 url: "passwordPrompt/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });
	// await the created popup to be closed and define a default
	let rv = await popupClosePromise(window.id, "cancel");
	console.log(rv);
 }

//listener to trigger the popup
messenger.composeAction.onClicked.addListener(blockingPopup);
