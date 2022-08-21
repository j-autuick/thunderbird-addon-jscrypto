console.log("0. background.js loaded.");
//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;

async function blockingPopup() {
	async function popupClosePromise(popupId, defaultPopupCloseMode) {
	
		try {
			// I believe this is the windowId for the popup window.
			await messenger.windows.get(popupId);
			console.log("5. ...");
		} catch (e) {
			//window does not exist, assume closed
			console.log("X. Second try reached. This should not be reached.");
			return defaultPopupCloseMode;
		}
		//end first async - with either have window id, or no window exists.
		return new Promise(resolve => {

			//on click - this will get the value from the "data"
			console.log("4. new Promise is ready to resolve -- loaded when Insecure pressed.");

			/* let bodyText = messenger.compose.getComposeDetails(tab.id);
			console("ok this is it! " + bodyText.body); */
			//on resolved promise -> close clicked button

			let popupCloseMode = defaultPopupCloseMode;
			function windowRemoveListener(closedId) {

			
				//TODO **** NEED PASSWORD HERE!! *****
				//above all works, now just this part -- //TODO How do I get the password here?
				//TODO __ currently, break here -- undefined.
				//create a async -> resolve to get password here? what is syntax?
				

				console.log("6.2 password entered is: ");

				//this works when uncommented.
				//console.log("10. Encrypt now! " + sjcl.encrypt(password, details.body));
				
				console.log("9. Random text to encrypt is: " + details.body);

				console.log("10. Removing window.  This is activated if a Cancel or Encrypt button is pressed.");
				console.log("popupId and closedId " + popupId + ", " + closedId);

				if (popupId == closedId) {


					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					//this resolves the promise
					console.log("11. All windows closed.");
					resolve(popupCloseMode);
				}
			}


			function messageListener(request, sender, sendResponse) {
				console.log("sender.tab.windowID " + sender.tab.windowId);
				console.log("popupId, request, request.popupCloseMode  " + popupId + ", " + request + ", " + request.popupCloseMode);
				if (sender.tab.windowId == popupId && request && request.popupCloseMode) {
					popupCloseMode = request.popupCloseMode;
				}
			}

			
			messenger.runtime.onMessage.addListener(messageListener);
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}

	console.log("3. Insecure button cliekd, about to kick start the popup! Namely, popup.html");
	let myPopup = await messenger.windows.create({
		 url: "popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });

	// this shows either encrypt or cancel - popup is closed (the popup.)
	//hmm this seems to be done way at the end.
	
	//return value? I guess
	let rv = await popupClosePromise(myPopup.id, "cancel");
	console.log("12. This is rv: " + rv);
}

async function getBodyText(tab) {
	/**
	 * This function grabs the body.
	 */
	//setting details
	details = await messenger.compose.getComposeDetails(tab.id);
	console.log("4. This is the body text from the getBodyText function: " + details.body);
}


//listener to trigger the popup - first things that start the entire addon.
console.log("1. addon started: blockingPopup async function called.");
messenger.composeAction.onClicked.addListener(blockingPopup);
console.log("2. simultanously, body text is captured.");
messenger.composeAction.onClicked.addListener(getBodyText);


