//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;
var currentComposeTabId;

async function blockingPopup() {
	async function popupClosePromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			return defaultPopupCloseMode;
		}

		return new Promise(resolve => {
			let popupCloseMode = defaultPopupCloseMode;
			
			function windowRemoveListener(closedId) {
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					if (popupCloseMode === "cancel" || popupCloseMode === undefined) {
					} else {
						let password = popupCloseMode;
						let newBody = sjcl.encrypt(password, details.body);
						messenger.compose.setComposeDetails(currentComposeTabId, { body: newBody })
					};
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
	let myPopup = await messenger.windows.create({
		 url: "encryptPopup/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });
	
	let rv = await popupClosePromise(myPopup.id, "cancel");
	console.log("17.4 This is the return value: " + rv);
}

async function getBodyText(tab) {
	details = await messenger.compose.getComposeDetails(tab.id);
	currentComposeTabId = tab.id;
}


async function decryptBlockingPopup() {
	async function popup2ClosePromise(popupId, defaultPopupCloseMode) {
		try {
			console.log("4.5 Entering 'popupClosePromise's' try block.")
			
			await messenger.windows.get(popupId);
		} catch (e) {
			//window does not exist, assume closed
			return defaultPopupCloseMode;
		}

		return new Promise(resolve => {
			let popupCloseMode2 = defaultPopupCloseMode;
			
			function windowRemoveListener(closedId) {
				if (popupId == closedId) {

					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					if (popupCloseMode2 === "cancel" || popupCloseMode2 === undefined) {

					} else {
						let password = popupCloseMode2;
					
						let newBody = sjcl.decrypt(password, details.body);
						console.log("17. newBody is " + newBody);
						//** HERE NEED SYNTAX FOR WRITING BACK TO MESSAGE WINDOW */
						//messenger.messages.update(currentComposeTabId, { body: newBody })
					};
					resolve(popupCloseMode2);
				}
			}
			function messageListener(request, sender, sendResponse) {
				
				if (sender.tab.windowId == popupId && request && request.popupCloseMode2) {
					
					popupCloseMode2 = request.popupCloseMode2;
				}
			}

			messenger.runtime.onMessage.addListener(messageListener);
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}
	
	let decryptPopup = await messenger.windows.create({
		 url: "decryptPopup/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });

	let rv = await popup2ClosePromise(decryptPopup.id, "cancel");

}
	
messenger.composeAction.onClicked.addListener(blockingPopup);
messenger.composeAction.onClicked.addListener(getBodyText);
messenger.messageDisplayAction.onClicked.addListener(decryptBlockingPopup);
