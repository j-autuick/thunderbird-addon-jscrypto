console.log("0. background.js loaded.");
//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;

async function blockingPopup() {
	async function popupClosePromise(popupId, defaultPopupCloseMode) {
	
		try {
			// Mozilla: details about a window, given it's Id. The details
			// are passed into a callback. messenger.windows.get(popupId) is an object Promise
			await messenger.windows.get(popupId);
			console.log("5. Getting details about the popup window: " + messenger.windows.get(popupId));
		} catch (e) {
			//window does not exist, assume closed
			console.log("X. Second try reached. This should not be reached, but the" +
			"popup I want is gone.");
			return defaultPopupCloseMode;
		}
		//end first async - with either have window id, or no window exists.
		return new Promise(resolve => {

			//on click - this will get the value from the "data"
			console.log("6. Promise is ready to resolve to ??");

			/* let bodyText = messenger.compose.getComposeDetails(tab.id);
			console("ok this is it! " + bodyText.body); */
			//on resolved promise -> close clicked button

			//this variable sets popupCloseMode to defaultPopupCloseMode
			//why?
			
			let popupCloseMode = defaultPopupCloseMode;

			//note this function is not async and all it's content fires through
			//one parameter..
			function windowRemoveListener(closedId) {
				/* This function only checks to see if popupId and closeId are the same
				if they are, it.. */

			
				//TODO **** NEED PASSWORD HERE!! *****
				//above all works, now just this part -- //TODO How do I get the password here?
				//TODO __ currently, break here -- undefined.
				//create a async -> resolve to get password here? what is syntax?
				var pw = popupClosePromise(myPopup.id, "cancel");
				console.log("11. This is pw: " + pw);

				//this works when uncommented.
				//console.log("10. Encrypt now! " + sjcl.encrypt(password, details.body));
				
				console.log("12. Random text to encrypt is: " + details.body);

				console.log("13. Removing window.  This is activated if a Cancel or Encrypt button is pressed.");
				console.log("popupId and closedId " + popupId + ", " + closedId);

				if (popupId == closedId) {

					//"windows.onRemoved" fired when the window is closed.
					//depreciated? removes the specified listener 
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					// similarly, like above..but at least..
					//runtime.onmessage = use this event to listen for messages
					//from another part of your extension.
					messenger.runtime.onMessage.removeListener(messageListener);
					//this resolves the promise
					console.log("14. All popup windows closed.");
					resolve(popupCloseMode);
				}
			}

			//custom made function that takes up to 2 arguments.
			function messageListener(request, sender, sendResponse) {
				console.log("sender.tab.windowID " + sender.tab.windowId);
				console.log("popupId, request, request.popupCloseMode  " + popupId + ", " + request + ", " + request.popupCloseMode);
				if (sender.tab.windowId == popupId && request && request.popupCloseMode) {
					//if all the above true, then the popup window is closed.
					console.log("closing Popup!")
					popupCloseMode = request.popupCloseMode;
				}
			}

			//listen for messages, adds a callback when invoked
			messenger.runtime.onMessage.addListener(messageListener);
			//fires when the popup is closed, removes the listener
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}

	console.log("3. Insecure button clicked, about to kick start the popup! Namely, popup.html");
	let myPopup = await messenger.windows.create({
		 url: "popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });

	// this shows either encrypt or cancel - popup is closed (the popup.)
	//hmm this seems to be done way at the end.
	
	//return value? I guess
	let pw = await popupClosePromise(myPopup.id);
	console.log("15. This is pw: " + pw);
	//this works when uncommented.
	console.log("16. Encrypting now! " + sjcl.encrypt(pw, details.body));
	let newBody = await sjcl.encrypt(pw, details.body);
	//newBody is ok.
	console.log("17. newBody is " + newBody);

	//this is a promise object
	console.log(" current id? " + await messenger.compose.getComposeDetails(myPopup.id));
	//another promise object 
	console.log(" what's this? " + await messenger.compose.setComposeDetails(myPopup.id, { body: newBody }));

	//Ok this is a promise!
	//console.log("my compose details: " + messenger.compose.getComposeDetails(myPopup.id));
	
	
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


