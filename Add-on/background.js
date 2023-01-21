//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;
var currentComposeTabId;

async function encryptionPopup() {
	async function closingEncryptionPopupPromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			//I don't know when this should ever fire. 
			return defaultPopupCloseMode;
		}

		return new Promise(resolve => {
			let closingEncryptionPopup = defaultPopupCloseMode;
			
			function windowRemoveListener(closedId) {
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					if (closingEncryptionPopup === "cancel" || closingEncryptionPopup === undefined) {
						console.log("We are inside here, but why?");
					} else {
						let password = closingEncryptionPopup;
						let newBody = sjcl.encrypt(password, details.body);
						messenger.compose.setComposeDetails(currentComposeTabId, { body: newBody })
					};
					resolve(closingEncryptionPopup);
				}
			}
			function messageListener(request, sender, sendResponse) {
				if (sender.tab.windowId == popupId && request && request.closingEncryptionPopup) {
					closingEncryptionPopup = request.closingEncryptionPopup;
				}
			}
			messenger.runtime.onMessage.addListener(messageListener);
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}
	let launchingEncryptionPopup = await messenger.windows.create({
		 url: "encryptPopup/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });
	
	let closingPopupOptionSelected = await closingEncryptionPopupPromise(launchingEncryptionPopup.id, "cancel");
	console.log("17.4 This is the return value: " + closingPopupOptionSelected);
}

async function getBodyText(tab) {
	details = await messenger.compose.getComposeDetails(tab.id);
	currentComposeTabId = tab.id;
}

async function decryptBlockingPopup() {
	async function popup2ClosePromise(popupId, defaultPopupCloseMode) {
		try {
			console.log("4.5 Entering 'pop2ClosePromise's' try block.")
			
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
	
// messenger.composeAction.onClicked.addListener(encryptionPopup);
// messenger.composeAction.onClicked.addListener(getBodyText);
// messenger.messageDisplayAction.onClicked.addListener(decryptBlockingPopup);

//********************************************************************** */


//start section on body ...

/**
 * Use the startup phase to tell Thunderbird that it should load
 * our message-content-script.js file whenever a message is displayed
 */
const handleStartup = () => {
messenger.messageDisplayScripts.register({
	js: [{ file: "messageContentScripts/message-content-script.js" }],
	css: [{ file: "messageContentScripts/message-content-styles.css" }],
});
};

/**
 * command handler: handles the commands received from the content script
 */
const doHandleCommand = async (message, sender) => {
const { command } = message;
const {
	tab: { id: tabId },
} = sender;

console.log("Inside doHandleCommand! Woo!");

};

/**
 * handle the received message by filtering for all messages
 * whose "type" property is set to "command".
 */
const handleMessage = (message, sender, sendResponse) => {
if (message && message.hasOwnProperty("command")) {
	// if we have a command, return a promise from the command handler
	console.log("Inside handleMessage. Woo!!");
	return doHandleCommand(message, sender);
}
};


/** Adding all handlers here */

messenger.composeAction.onClicked.addListener(encryptionPopup);
messenger.composeAction.onClicked.addListener(getBodyText);
messenger.messageDisplayAction.onClicked.addListener(decryptBlockingPopup);
/**
 * Add a handler for communication with other parts of the extension,
 * like our messageDisplayScript.
 *
 * 👉 There should be only one handler in the background script
 *    for all incoming messages
 */
messenger.runtime.onMessage.addListener(handleMessage);

/**
 * Execute the startup handler whenever Thunderbird starts
 * ----this doesn't work, for whatever reason?? added this.seems to work now
 */
document.addEventListener("DOMContentLoaded", this.handleStartup);
