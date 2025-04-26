/**
 * Project: Thunderbird Cryptography Add-on
 * File: popup.js
 * Description: This is the encryption popup window javascript
 *  logic.
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

window.addEventListener("load", onLoad);

async function notifyMode(event) {
    const passwordInput = document.getElementById("password_input");
    const password = passwordInput.value;

    // Notify background with password
    await messenger.runtime.sendMessage({ closingEncryptionPopup: password });

    // Close the popup window
    const win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
}

async function cancelPopup() {
    // Notify background with cancel status
    await messenger.runtime.sendMessage({ closingEncryptionPopup: "cancel" });

    // Close the popup window
    const win = await messenger.windows.getCurrent();
    messenger.windows.remove(win.id);
}

async function onLoad() {
    const input = document.getElementById("password_input");
    const encryptBtn = document.getElementById("button_ok");
    const cancelBtn = document.getElementById("button_cancel");

    encryptBtn.addEventListener("click", notifyMode);
    cancelBtn.addEventListener("click", cancelPopup);

    // Set focus on the input field
    input.focus();

    // Handle Enter key to trigger the Decrypt button
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            encryptBtn.click();
        }
    });
}
