/**
 * Project: Thunderbird Cryptography Add-on
 * File: messageDisplay.js
 * Description: This file is used for updating the text that is
 * decrypted within the message window.
 *
 * Author: Drexl
 * License: GNU General Public License v3.0
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * © 2025 Drexl
 */

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
  