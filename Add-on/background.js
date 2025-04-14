//This imports the Stanford JavaScript Cryptography Library into this file.
var imported = document.createElement('script');
imported.src = 'sjcl.js';
document.head.appendChild(imported);

// Register the message display script. Not sure if this works.
/** Ok encryption+sending works without this...

messenger.messageDisplayScripts.register({
    js: [{ file: "messageContentScripts/message-content-script.js" }],
    //css: [{ file: "../message-content-styles.css" }],
});
*/

var currentComposeTabId;

function looksLikeEncryptedJson(text) {
	try {
		const obj = JSON.parse(text);
		return (
			obj.iv && obj.v && obj.iter && obj.ks && obj.cipher && obj.ct
		);
	} catch (e) {
		return false;
	}
}

async function encryptionPopup() {
	async function closingEncryptionPopupPromise(popupId, defaultPopupCloseMode) {
		try {
			await messenger.windows.get(popupId);
		} catch (e) {
			return defaultPopupCloseMode;
		}

		return new Promise(resolve => {
			let closingEncryptionPopup = defaultPopupCloseMode;
			
			function windowRemoveListener(closedId) {
				if (popupId == closedId) {
					messenger.windows.onRemoved.removeListener(windowRemoveListener);
					messenger.runtime.onMessage.removeListener(messageListener);
					if (closingEncryptionPopup === "cancel" || closingEncryptionPopup === undefined) {
					} else {
						//API allows this to all work nicely.
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
}

async function getBodyTextFromComposeWindow(tab) {
	console.log("this function, getBodyTextFromComposeWindow called!")
	details = await messenger.compose.getComposeDetails(tab.id);
	currentComposeTabId = tab.id;
	console.log(details)
}

// async function decryptionPopup() {
//     async function waitForPopupClose(popupId, fallback = "cancel") {
//         try {
//             await messenger.windows.get(popupId);
//         } catch (error) {
//             console.warn("Popup was already closed.");
//             return fallback;
//         }

//         return new Promise(resolve => {
//             let result = fallback;

//             function onPopupClosed(closedId) {
//                 if (closedId !== popupId) return;

//                 console.log("[Popup Closed] Result:", result);
//                 cleanupListeners();
//                 resolve(result);
//             }

//             function onPopupMessage(request, sender) {
//                 if (sender.tab?.windowId !== popupId) return;

//                 if (request?.closingDecryptionPopup !== undefined && request.closingDecryptionPopup !== null) {
//                     result = request.closingDecryptionPopup;
//                     console.log("[Message Received] closingDecryptionPopup:", result);
//                 }
//             }

//             function cleanupListeners() {
//                 messenger.windows.onRemoved.removeListener(onPopupClosed);
//                 messenger.runtime.onMessage.removeListener(onPopupMessage);
//             }

//             messenger.windows.onRemoved.addListener(onPopupClosed);
//             messenger.runtime.onMessage.addListener(onPopupMessage);
//         });
//     }

//     try {
//         let [tab] = await messenger.tabs.query({ active: true, currentWindow: true });
//         let message = await messenger.messageDisplay.getDisplayedMessage(tab.id);
//         let full = await messenger.messages.getFull(message.id);

//         function findTextPart(part) {
//             if (part.parts) {
//                 for (let subPart of part.parts) {
//                     let found = findTextPart(subPart);
//                     if (found) return found;
//                 }
//             }
//             if (part.contentType === "text/plain") {
//                 return part;
//             }
//             return null;
//         }

//         let textPart = findTextPart(full);

//         if (!textPart || !textPart.body) {
//             console.warn("Message is not encrypted. Showing warning popup.");
//             await messenger.windows.create({
//                 url: "msg_not_encrypted/msg-not-encrypted.html",
//                 type: "popup",
//                 height: 180,
//                 width: 390
//             });
//             return;
//         }

//         const encryptedText = textPart.body.trim();

//         // Check if encryptedText is a likely SJCL-encrypted string
//         let isProbablySJCL = false;
//         try {
//             const parsed = JSON.parse(encryptedText);
//             if (parsed.iv && parsed.ct && parsed.mode && parsed.ks) {
//                 isProbablySJCL = true;
//             }
//         } catch (e) {
//             // Not JSON, definitely not SJCL
//         }

//         if (!isProbablySJCL) {
//             console.warn("Message doesn't look like SJCL-encrypted data. Showing warning popup.");
//             await messenger.windows.create({
//                 url: "msg_not_encrypted/msg-not-encrypted.html",
//                 type: "popup",
//                 height: 180,
//                 width: 390
//             });
//             return;
//         }

//         // Now show password popup
//         const popup = await messenger.windows.create({
//             url: "decryptPopup/popup.html",
//             type: "popup",
//             height: 180,
//             width: 390
//         });

//         const userInput = await waitForPopupClose(popup.id, "cancel");
//         if (userInput === "cancel") {
//             console.log("User canceled decryption.");
//             return;
//         }

//         // Try decryption
//         let decryptedMessage;
//         try {
//             decryptedMessage = sjcl.decrypt(userInput, encryptedText);
//             console.log("Decrypted message:", decryptedMessage);
//         } catch (err) {
//             const message = err?.message || err?.toString?.() || "";
//             if (message.includes("ccm: tag doesn't match")) {
//                 console.log("Password is incorrect – showing error popup.");
//                 await messenger.windows.create({
//                     url: "wrong_password/wrong-password.html",
//                     type: "popup",
//                     height: 200,
//                     width: 390
//                 });
//             } else {
//                 console.error("Decryption failed:", message);
//             }
//             return;
//         }

//         // Parse and extract message
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(decryptedMessage, "text/html");
//         const pElement = doc.querySelector("p");
//         let decryptedText = pElement ? pElement.textContent.trim() : decryptedMessage;

//         await messenger.tabs.executeScript(tab.id, {
//             code: `
//                 var decryptedText = \`${decryptedText}\`;
//                 document.body.innerHTML = '<p>' + decryptedText + '</p>';
//             `
//         });

//     } catch (err) {
//         console.error("Unexpected failure in decryptionPopup():", err.message || err);
//     }
// }

async function decryptionPopup() {
    try {
        const tab = await getActiveTab();
        const messageText = await getPlainTextMessage(tab.id);

        if (!isSJCLFormatted(messageText)) {
            await showPopup("msg_not_encrypted/msg-not-encrypted.html", 180);
            return;
        }

        const password = await promptForPassword();
        if (password === "cancel") {
            console.log("User canceled decryption.");
            return;
        }

        const decrypted = decryptMessage(password, messageText);
        const cleanText = extractDecryptedText(decrypted);

        await displayDecryptedText(tab.id, cleanText);

    } catch (err) {
        console.error("Unexpected failure in decryptionPopup():", err.message || err);
    }
}

async function getActiveTab() {
    const [tab] = await messenger.tabs.query({ active: true, currentWindow: true });
    return tab;
}

async function getPlainTextMessage(tabId) {
    const message = await messenger.messageDisplay.getDisplayedMessage(tabId);
    const full = await messenger.messages.getFull(message.id);

    const findTextPart = (part) => {
        if (part.parts) {
            for (let sub of part.parts) {
                const found = findTextPart(sub);
                if (found) return found;
            }
        }
        return part.contentType === "text/plain" ? part : null;
    };

    const textPart = findTextPart(full);
    if (!textPart || !textPart.body) throw new Error("No text/plain part found in message.");

    return textPart.body.trim();
}

function isSJCLFormatted(text) {
    try {
        const parsed = JSON.parse(text);
        return parsed && parsed.iv && parsed.ct && parsed.mode && parsed.ks;
    } catch {
        return false;
    }
}

async function showPopup(url, height = 180, width = 390) {
    await messenger.windows.create({ url, type: "popup", height, width });
}

async function promptForPassword() {
    const popup = await messenger.windows.create({
        url: "decryptPopup/popup.html",
        type: "popup",
        height: 180,
        width: 390
    });

    return await waitForPopupClose(popup.id, "cancel");
}

async function waitForPopupClose(popupId, fallback = "cancel") {
    try {
        await messenger.windows.get(popupId);
    } catch {
        console.warn("Popup already closed.");
        return fallback;
    }

    return new Promise(resolve => {
        let result = fallback;

        function onClosed(id) {
            if (id !== popupId) return;
            cleanup();
            resolve(result);
        }

        function onMessage(request, sender) {
            if (sender.tab?.windowId !== popupId) return;
            if (request?.closingDecryptionPopup !== undefined) {
                result = request.closingDecryptionPopup;
            }
        }

        function cleanup() {
            messenger.windows.onRemoved.removeListener(onClosed);
            messenger.runtime.onMessage.removeListener(onMessage);
        }

        messenger.windows.onRemoved.addListener(onClosed);
        messenger.runtime.onMessage.addListener(onMessage);
    });
}

function decryptMessage(password, encryptedText) {
    try {
        return sjcl.decrypt(password, encryptedText);
    } catch (err) {
        const msg = err?.message || err?.toString?.() || "";
        if (msg.includes("ccm: tag doesn't match")) {
            showPopup("wrong_password/wrong-password.html", 240);
        } else {
            console.error("Decryption failed:", msg);
        }
        throw err;
    }
}

function extractDecryptedText(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const p = doc.querySelector("p");
    return p ? p.textContent.trim() : htmlString;
}

async function displayDecryptedText(tabId, text) {
    await messenger.tabs.executeScript(tabId, {
        code: `
            document.body.innerHTML = '<p>' + \`${text}\` + '</p>';
        `
    });
}


messenger.runtime.onMessage.addListener((message) => {
	if (message.retryDecryption !== undefined) {
	  if (message.retryDecryption) {
		// Relaunch decryption popup
		decryptionPopup(); 
	  } else {
		console.log("User canceled retry.");
	  }
	}
  });
  

messenger.composeAction.onClicked.addListener(encryptionPopup);
messenger.messageDisplayAction.onClicked.addListener(decryptionPopup);
messenger.composeAction.onClicked.addListener(getBodyTextFromComposeWindow);
  
messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Received message from popup:", message);
	if (message.closingDecryptionPopup) {
		console.log("Password received via messaging system:", message.closingDecryptionPopup);
	}
  });
  