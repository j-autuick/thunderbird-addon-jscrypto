//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

// Register the message display script.
messenger.messageDisplayScripts.register({
    js: [{ file: "messageContentScripts/message-content-script.js" }],
    //css: [{ file: "../message-content-styles.css" }],
});

var currentComposeTabId;

async function encryptionPopup() {
	async function closingEncryptionPopupPromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			console.log("We have erred and are now activating defaultPopupCloseMode");
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
	
	let closingEncryptionPopupOption = await closingEncryptionPopupPromise(launchingEncryptionPopup.id, "cancel");
	console.log("17.4 This is the return value: " + closingEncryptionPopupOption);
}

async function getBodyTextFromComposeWindow(tab) {
	//This will only work from the compose window. otherwise, the pw will not be collected
	details = await messenger.compose.getComposeDetails(tab.id);
	currentComposeTabId = tab.id;
}

	

async function decryptionPopup() {
	async function closingDecryptionPopupPromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			console.log("We are about to abort <HERE>");
			return defaultPopupCloseMode;
		}

		return new Promise(resolve => {
			let closingDecryptionPopup = defaultPopupCloseMode;
			
			function windowRemoveListener(closedId) {
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					if (closingDecryptionPopup === "cancel" || closingDecryptionPopup === undefined) {

					} else {
						console.log("what is closingDecryptionPopup? " + closingDecryptionPopup);
						console.log("We doing work now...");
						//Have password -> add text from above, and decrypt
						let password = closingDecryptionPopup;
						//where did I get details.body from?
						//can I get the body in here?
						let oldBody = 
						//let newBody = sjcl.decrypt(password, oldBody);
						console.log("Message Body is: " + oldBody);
						//console.log("newBody is: " + newBody);


						console.log("Inside decryption loop, password: " + password);
						//TODO: get document.body "text" - need to use the content scripts. meh
						
						//TODO: replace the 'new' decrypted text into the document body.

					};
					resolve(closingDecryptionPopup);
				}
			}
			function messageListener(request, sender, sendResponse) {
				
				if (sender.tab.windowId == popupId && request && request.closingDecryptionPopup) {
					closingDecryptionPopup = request.closingDecryptionPopup;
				}
			}

			messenger.runtime.onMessage.addListener(messageListener);
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}
	
	let launchingDecryptPopup = await messenger.windows.create({
		 url: "decryptPopup/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });

	//this returns immediately to cancel, why?
	let closingDecryptionPopupOption = await closingDecryptionPopupPromise(launchingDecryptPopup.id, "cancel");
	console.log("Selected closing option: " + closingDecryptionPopupOption);
}


//TODO Where I am at: the content script is 100% not understood, and probably mostly wrong. fix, step by step.
/**
 * Use the startup phase to tell Thunderbird that it should load
 * our message-content-script.js file whenever a message is displayed
 */
// const handleStartup = () => {
// messenger.messageDisplayScripts.register({
// 	js: [{ file: "messageContentScripts/message-content-script.js" }],
// 	//will delete the following soon, don't need it.
// 	//css: [{ file: "messageContentScripts/message-content-styles.css" }],
// });
// };

/**
 * command handler: handles the commands received from the content script
 */
// const doHandleCommand = async (message, sender) => {
// const { command } = message;
// const {
// 	tab: { id: tabId },
// } = sender;

// console.log("Inside doHandleCommand! Woo!");

// };

// /**
//  * handle the received message by filtering for all messages
//  * whose "type" property is set to "command".
//  */
// const handleMessage = (message, sender, sendResponse) => {
// if (message && message.hasOwnProperty("command")) {
// 	// if we have a command, return a promise from the command handler
// 	console.log("Inside handleMessage. Woo!!");
// 	console.log("anything? " + getNotificationsDetails);
// 	return doHandleCommand(message, sender);
// }
// };


/** Adding all handlers here */

messenger.composeAction.onClicked.addListener(encryptionPopup);
messenger.messageDisplayAction.onClicked.addListener(decryptionPopup);

//this really only works from the compose window. busted.
messenger.composeAction.onClicked.addListener(getBodyTextFromComposeWindow);

// /**
//  * Add a handler for communication with other parts of the extension
//  *
//  * 👉 There should be only one handler in the background script
//  *    for all incoming messages
//  */
// messenger.runtime.onMessage.addListener(handleMessage);

// /**
//  * Execute the startup handler whenever Thunderbird starts
//  */
// document.addEventListener("DOMContentLoaded", handleStartup);


// background-script.js
// function handleMessage(request, sender, sendResponse) {
// 	console.log(`A content script sent a message: ${request.greeting}`);
// 	//1. We are getting inside here, but not getting a response!
// 	//console.log("A content script sent a message: " + request.);
// 	sendResponse({ response: "Response from background script" });
// 	//return Promise.resolve({response: "response from background script."});
//   }
  
// browser.runtime.onMessage.addListener(handleMessage);

/**
 * Add a handler for the communication with other parts of the extension,
 * like our message display script.
 *
 * Note: It is best practice to always define a synchronous listener
 *       function for the runtime.onMessage event.
 *       If defined asynchronously, it will always return a Promise
 *       and therefore answer all messages, even if a different listener
 *       defined elsewhere is supposed to handle these.
 * 
 *       The listener should only return a Promise for messages it is
 *       actually supposed to handle.
 */
messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check what type of message we have received and invoke the appropriate
    // handler function.
    if (message && message.hasOwnProperty("command")) {
        return commandHandler(message, sender);
    }
    // Return false if the message was not handled by this listener.
    return false;
});

// The actual (asynchronous) handler for command messages.
async function commandHandler(message, sender) {
    // Get the message currently displayed in the sending tab, abort if
    // that failed.
    const messageHeader = await messenger.messageDisplay.getDisplayedMessage(
        sender.tab.id
    );

    if (!messageHeader) {
        return;
    }

    // Check for known commands.
    switch (message.command) {
        // case "getBannerDetails":
        //     // Create the information we want to return to our message display
        //     // script.
        //     return { text: `Mail subject is "${messageHeader.subject}"` };
		case "sayHi":
			return { text: console.log("HI") };
        // case "markUnread":
        //     // Mark the message as unread.
        //     messenger.messages.update(messageHeader.id, {
        //         read: false,
        //     });
        // break;
    }
}
  