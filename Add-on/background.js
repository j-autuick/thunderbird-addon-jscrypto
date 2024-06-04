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
						//this is gonna be all crap. it has to be done in the content-script.
						//BUT, I need to send the password!
						console.log("what is closingDecryptionPopup? " + closingDecryptionPopup);
						console.log("We doing work now...");
						//Have password -> add text from above, and decrypt
						let password = "cats";
						//where did I get details.body from?
						//can I get the body in here?
						
						console.log("Inside decryption loop, password: " + password);

						let oldBody2 = '{"iv":"7/yTUj7X+qUvXCwzlgTvGQ==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"UXJXd14GVhM=","ct":"1/bnGAHgrOv0Sd3/UE0fzUILPvORW0aWUgwvMFlvTDD77ARUyrtJRBwbxeJHJGvxdcXLilxwhvqu5/7tiARzUsWZd20U/GASRPP0SJrQ0yhIa3pyKnG+Uce3nex/glFuYTnMwDvzTBqsxN/sKh13vktNlvyiHmjxXZl42a8weXhTvF+0HFsSi30NoacXlHwyc00lGkTpFi6A4kg="}';
						console.log("Inside decryption loop, Message Body is: " + oldBody2);
						
						let newBody2 = sjcl.decrypt(password, oldBody2);
						console.log("what is a newBody2?" + newBody2);
						console.log("Inside decryption loop, newBody is: " + newBody2);
						//leave newBody2 as is...send it to the message content script.
						//TODO: get document.body "text" - need to use the content scripts. meh
						
						//this gets us some script tag??
						//msgBody = document.getElementsByTagName("body")[0].innerHTML;
						
						//not sure any of this shit is useful.
						//console.log("msgBody is: " + msgBody);
  						//let oldBody = msgBody[0].innerText;
						//console.log("Oldbody from background is: " + oldBody);
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

messenger.composeAction.onClicked.addListener(encryptionPopup);
messenger.messageDisplayAction.onClicked.addListener(decryptionPopup);

//this really only works from the compose window. busted.
messenger.composeAction.onClicked.addListener(getBodyTextFromComposeWindow);


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
	//const msgBody = await messenger.messages.getFull(sender.tab.id);
    const messageHeader = await messenger.messageDisplay.getDisplayedMessage(
        sender.tab.id
    );
	
	

    if (!messageHeader) {
        return;
    }

    // Check for known commands.
    switch (message.command) {
		case "sayHello":
			//let dog = "Dog is a variable from the background-page.";
			return { text: newBody2};
    }
}
// background.js
let activeTabId; // Store the active tabId

// Listen for tab activation
browser.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});

// You can also listen for tab creation
browser.tabs.onCreated.addListener((tab) => {
  // Store the tabId here if needed
});

// background.js
function injectContentScript() {
	// Check if there's an active tabId
	if (activeTabId) {
	  // Execute content script in the active tab with the tabId
	  browser.tabs.executeScript(activeTabId, {
		file: "content.js" // Replace with your content script filename
	  });
	}
  }
  
  // Example: Execute content script when the extension icon is clicked
  browser.browserAction.onClicked.addListener(injectContentScript);
  
