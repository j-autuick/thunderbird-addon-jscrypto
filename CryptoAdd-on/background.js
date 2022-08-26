console.log("0. background.js LOADED.");
//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;
var currentComposeTabId;

async function blockingPopup() {

	console.log("2.5 'Insecure' button has been pressed: now inside blockingPopup.");

	//defaultPopupCloseMode parameter for either Ok or Cancel!
	//popupId is parameter for the popup's id
	async function popupClosePromise(popupId, defaultPopupCloseMode) {

		//ok undefined.
		console.log("3.2 What is the defaultPopupCloseMode value? " + defaultPopupCloseMode);
		
		try {
			console.log("4.5 Entering 'popupClosePromise's' try block.")
			
			// Mozilla: details about a window, given it's Id. The details
			// are passed into a callback. messenger.windows.get(popupId) is an object Promise
			//so in some this is the details of the window with given popupId
			await messenger.windows.get(popupId);
			console.log("5. Getting details about the popup window: (and Object Promise)" + messenger.windows.get(popupId));
		} catch (e) {
			//window does not exist, assume closed
			console.log("17.6 Second try reached. This should not be reached, but the" +
			"popup I want is gone.");
			//this is always "cancel"
			console.log("17.7 defaultPopupCloseMode = " + defaultPopupCloseMode);
			return defaultPopupCloseMode;
		}

		return new Promise(resolve => {

			//on click - this will get the value from the "data", so the promise
			//is fulfilled.

			console.log("6. now inside the new Promise - ready to resolve.");

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
				//var pw = popupClosePromise(myPopup.id, "cancel");
				//console.log("11. This is pw: (Object Promise)" + pw);

				//this works when uncommented.
				//console.log("10. Encrypt now! " + sjcl.encrypt(password, details.body));
				
				console.log("12. Random text to encrypt is: " + details.body);

				console.log("13. Removing window.  This is activated if a Cancel or Encrypt button is pressed.");
				console.log("13.1 popupId and closedId " + popupId + ", " + closedId);

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
				console.log("This get called twice: (1) between 9.1 & 10, (2) after 10.")
				console.log("10.09 Inside messageListener function. How did we get called?")
				console.log("10.1 sender.tab.windowID " + sender.tab.windowId);
				console.log("10.2 popupId, request, request.popupCloseMode  " + popupId + ", " + request + ", " + request.popupCloseMode);
				if (sender.tab.windowId == popupId && request && request.popupCloseMode) {
					//if all the above true, then the popup window is closed.
					console.log("This is true between 10.2 and 10 -- first pass.")
					console.log("10.3 closing Popup, really!")
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
	
	console.log("3.1 This is originally called earlier!")
	let pw = await popupClosePromise(myPopup.id);
	console.log("15. This is pw: " + pw);

	console.log("16. Encrypting now! " + sjcl.encrypt(pw, details.body));
	let newBody = await sjcl.encrypt(pw, details.body);

	console.log("17. newBody is " + newBody);
	console.log("17.5 current tabId " + currentComposeTabId);
	//this is a promise object
	//console.log("18. current id? " + tab.id);
	//another promise object 

	//this is undefined.
	console.log("18. what's this? " + await messenger.compose.setComposeDetails(currentComposeTabId, { body: newBody }));

	console.log("19. Decrypting now to console " + sjcl.decrypt(pw, newBody));
	//Ok this is a promise!
	//console.log("my compose details: " + messenger.compose.getComposeDetails(myPopup.id));
	
	
}

async function getBodyText(tab) {
	/**
	 * This function grabs the body.
	 */
	//setting details
	details = await messenger.compose.getComposeDetails(tab.id);
	currentComposeTabId = tab.id;
	//this works, so commenting these out for now.
	console.log("4. Inside getBodyText(tab) function. it works as expected.")
	
}




//listener to trigger the popup - first things that start the entire addon.
console.log("1. addon LOADED: blockingPopup async function is available, but not yet called.");
messenger.composeAction.onClicked.addListener(blockingPopup);
console.log("2. simultanously, body text function is LOADED, but not called.");
messenger.composeAction.onClicked.addListener(getBodyText);

//test if this works
//messenger.composeAction.onClicked.addListener(getPassword);


