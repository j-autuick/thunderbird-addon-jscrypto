// console.log("0. background.js LOADED.");
//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

var details;
var currentComposeTabId;

async function blockingPopup() {

	console.log("2.5 'Insecure' button activated: now inside blockingPopup.");

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
			//this means popup is up and running

			console.log("6. now inside the new Promise - ready to resolve.");

			//this variable sets popupCloseMode to defaultPopupCloseMode
			//why?
			let popupCloseMode = defaultPopupCloseMode;
			
			//note this function is not async and all it's content fires through
			//one parameter..not yet called...but when
			function windowRemoveListener(closedId) {
				/* This function only checks to see if popupId and closeId are the same
				if they are, it.. */
				

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
					console.log("15. password value is: " + popupCloseMode)
					if (popupCloseMode === "cancel" || popupCloseMode === undefined) {
						console.log("Cancel has been pressed.");
					} else {
						a
					};
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
			console.log("6.5 These listeners are now active");
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}
	
	console.log("3. Insecure button clicked, about to kick start the popup! Namely, popup.html");
	let myPopup = await messenger.windows.create({
		 url: "encryptPopup/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });
	
	console.log("3.1 this is bad coding, but will get us the password from the popup callback.");
	//calls the popupClosePromise function
	//let pw = await popupClosePromise(myPopup.id);

	//resume running here after callback.
	//console.log("15. finally, pw is called back: " + pw);

	let rv = await popupClosePromise(myPopup.id, "cancel");
	console.log("17.4 This is the return value: " + rv);

	
	console.log("17.5 current tabId " + currentComposeTabId);
	//this is a promise object
	//console.log("18. current id? " + tab.id);
	//another promise object 

	//this is undefined.
	//console.log("18. what's this? " + await messenger.compose.setComposeDetails(currentComposeTabId, { body: newBody }));

	//console.log("19. Decrypting now to console " + sjcl.decrypt(pw, newBody));
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
	// console.log("4. Inside getBodyText(tab) function. it works as expected.")
}




//********************************************************************************** */



async function decryptBlockingPopup() {

	console.log("2.5 'Insecure' button activated: now inside blockingPopup.");

	//defaultPopupCloseMode parameter for either Ok or Cancel!
	//popupId is parameter for the popup's id
	async function popup2ClosePromise(popupId, defaultPopupCloseMode) {

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
			//this means popup is up and running

			console.log("6. now inside the new Promise - ready to resolve.");

			//this variable sets popupCloseMode to defaultPopupCloseMode
			//why?
			let popupCloseMode2 = defaultPopupCloseMode;
			
			//note this function is not async and all it's content fires through
			//one parameter..not yet called...but when
			function windowRemoveListener(closedId) {
				/* This function only checks to see if popupId and closeId are the same
				if they are, it.. */

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
					console.log("15. password value is: " + popupCloseMode2)
					if (popupCloseMode2 === "cancel" || popupCloseMode2 === undefined) {
						console.log("Cancel has been pressed.");
					} else {
						let password = popupCloseMode2;
						//let password = popupClosePromise(myPopup.id);
						//console.log("16. Encrypting now! " + sjcl.encrypt(password, details.body));
						
						console.log("12. Random text to encrypt is: " + details.body);
						let newBody = sjcl.decrypt(password, details.body);
						console.log("17. newBody is " + newBody);
						//** HERE NEED SYNTAX FOR WRITING BACK TO MESSAGE WINDOW */
						//messenger.messages.update(currentComposeTabId, { body: newBody })
						console.log("Here would be a good spot to execute encryption.");
					};
					resolve(popupCloseMode2);
				}
			}

			//custom made function that takes up to 2 arguments.
			function messageListener(request, sender, sendResponse) {
				console.log("This get called twice: (1) between 9.1 & 10, (2) after 10.")
				console.log("10.09 Inside messageListener function. How did we get called?")
				console.log("10.1 sender.tab.windowID " + sender.tab.windowId);
				console.log("10.2 popupId, request, request.popupCloseMode  " + popupId + ", " + request + ", " + request.popupCloseMode2);
				if (sender.tab.windowId == popupId && request && request.popupCloseMode2) {
					//if all the above true, then the popup window is closed.
					console.log("This is true between 10.2 and 10 -- first pass.")
					console.log("10.3 closing Popup, really!")
					popupCloseMode2 = request.popupCloseMode2;
				}
			}

			//listen for messages, adds a callback when invoked
			messenger.runtime.onMessage.addListener(messageListener);
			//fires when the popup is closed, removes the listener
			console.log("6.5 These listeners are now active");
			messenger.windows.onRemoved.addListener(windowRemoveListener);
		});
	}
	
	console.log("3. Insecure button clicked, about to kick start the popup! Namely, popup.html");
	let decryptPopup = await messenger.windows.create({
		 url: "decryptPopup/popup.html",
		 type: "popup",
		 height: 180,
		 width: 390 });
	
	console.log("3.1 this is bad coding, but will get us the password from the popup callback.");
	//calls the popupClosePromise function
	//let pw = await popupClosePromise(myPopup.id);

	//resume running here after callback.
	//console.log("15. finally, pw is called back: " + pw);

	let rv = await popup2ClosePromise(decryptPopup.id, "cancel");
	console.log("17.4 This is the return value: " + rv);

	
	console.log("17.5 current tabId " + currentComposeTabId);
	//this is a promise object
	//console.log("18. current id? " + tab.id);
	//another promise object 

	//this is undefined.
	//console.log("18. what's this? " + await messenger.compose.setComposeDetails(currentComposeTabId, { body: newBody }));

	//console.log("19. Decrypting now to console " + sjcl.decrypt(pw, newBody));
	//Ok this is a promise!
	//console.log("my compose details: " + messenger.compose.getComposeDetails(myPopup.id));
}


//listener to trigger the popup - first things that start the entire addon.
// console.log("1. addon LOADED: blockingPopup async function is available, but not yet called.");
messenger.composeAction.onClicked.addListener(blockingPopup);
// console.log("2. simultanously, body text function is LOADED, but not called.");
messenger.composeAction.onClicked.addListener(getBodyText);

//used for decode button
//listener to trigger the popup
messenger.messageDisplayAction.onClicked.addListener(decryptBlockingPopup);





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
  
	//const messageHeader = await browser.messageDisplay.getDisplayedMessage(tabId);
  
	// check for known commands
	// switch (command.toLocaleLowerCase()) {
	//   case "getnotificationdetails":
	// 	{
	// 	  // create the information chunk we want to return to our message content script
	// 	  return {
	// 		text: `Mail subject is "${messageHeader.subject}"`,
	// 	  };
	// 	}
		// break;
  
	//   case "markunread":
	// 	{
	// 	  // get the current message from the given tab
	// 	  if (messageHeader) {
	// 		// mark the message as unread
	// 		browser.messages.update(messageHeader.id, {
	// 		  read: false,
	// 		});
	// 	  }
	// 	}
	// 	break;
	// }
  };
  
  /**
   * handle the received message by filtering for all messages
   * whose "type" property is set to "command".
   */
  const handleMessage = (message, sender, sendResponse) => {
	if (message && message.hasOwnProperty("command")) {
	  // if we have a command, return a promise from the command handler
	  return doHandleCommand(message, sender);
	}
  };
  
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
   */
  document.addEventListener("DOMContentLoaded", handleStartup);
  