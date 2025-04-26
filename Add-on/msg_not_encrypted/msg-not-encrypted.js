/**
 * Project: Thunderbird Cryptography Add-on
 * File: msg-not-encrypted.js
 * Description: handles the logic if a message is not encrypted, 
 * and it's associated popup window.
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
document.addEventListener("DOMContentLoaded", () => {
    const okButton = document.getElementById("button_ok");

    okButton.addEventListener("click", async () => {
        const win = await messenger.windows.getCurrent();
        messenger.windows.remove(win.id);
    });
});
