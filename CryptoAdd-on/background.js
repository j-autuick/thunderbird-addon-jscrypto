console.log("1. background.js loaded.");

//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;

// Function to open a popup and await user feedback
async function blockingPopup() {
	async function popupClosePromise(popupId, defaultPopupCloseMode) {
		//first async -> get window ID
		try {
			await messenger.windows.get(popupId);
			console.log("2. First try reached.");
		} catch (e) {
			//window does not exist, assume closed
			console.log("X. Second try reached. This is never reached, probably can remove?");
			return defaultPopupCloseMode;
		}
		//end first async - with either have window id, or no window exists.
		return new Promise(resolve => {
			console.log("3. First promise is ready to resolve -- when compose button 'Insecure' is pressed.");
			/* let bodyText = messenger.compose.getComposeDetails(tab.id);
			console("ok this is it! " + bodyText.body); */
			//on resolved promise -> close clicked button
			let popupCloseMode = defaultPopupCloseMode;
			function windowRemoveListener(closedId) {
				//get we get the body here? -- this seems like the right spot, need to get something other than 
				//undefined. This is where I want it!

				console.log("7. Random text to encrypt is: " + details.body);
				
				//TODO **** NEED PASSWORD HERE!! *****
				//above all works, now just this part -- //TODO How do I get the password here?
				console.log("6.5. password entered is: " + password);

				//this works when uncommented.
				//console.log("10. Encrypt now! " + sjcl.encrypt(password, details.body));

				console.log("8. Removing window.  This is activated if a Cancel or Encrypt button is pressed.");
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					//this resolves the promise
					console.log("9. All windows closed.");
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
		 url: "popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });

	// this shows either encrypt or cancel - popup is closed (the popup.)
	//hmm this seems to be done way at the end.
	let rv = await popupClosePromise(myPopup.id, "cancel");
	console.log("10. This is rv: " + rv);
}

async function getBodyText(tab) {
	//setting details
	details = await messenger.compose.getComposeDetails(tab.id);
	console.log("1.5? Eh. This is the body text from the getBodyText function: " + details.body);
}

//listener to trigger the popup - event listener? or listener? the difference?
messenger.composeAction.onClicked.addListener(blockingPopup);
messenger.composeAction.onClicked.addListener(getBodyText);


