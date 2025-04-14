(async () => {
    try {
      const displayedMessage = await messenger.messageDisplay.getDisplayedMessage();
      const fullMessage = await messenger.messages.getFull(displayedMessage.id);
  
      // Look for an HTML part in the message
      let htmlPart = null;
      for (const part of fullMessage.parts) {
        if (part.contentType === "text/html" && part.body) {
          htmlPart = part;
          break;
        }
      }
  
      if (!htmlPart) {
        console.warn("No HTML part found in the message.");
        return;
      }
  
      // Parse HTML body to extract <p> content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlPart.body, "text/html");
      const pElement = doc.querySelector("p");
  
      if (!pElement) {
        console.warn("No <p> element found in the HTML.");
        return;
      }
  
      const encryptedText = pElement.textContent.trim();
      console.log("Encrypted text:", encryptedText);
  
      // DECRYPT
      const password = "yourPasswordHere"; // Replace with your real password logic
      try {
        const decrypted = sjcl.decrypt(password, encryptedText);
        console.log("Decrypted text:", decrypted);
      } catch (err) {
        console.error("Decryption failed:", err.message || err);
      }
  
    } catch (err) {
      console.error("General error in messageDisplayScript:", err);
    }
  })();
  