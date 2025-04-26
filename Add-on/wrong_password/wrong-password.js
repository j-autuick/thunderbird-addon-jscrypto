/**
 * Project: Thunderbird Cryptography Add-on
 * File: wrong-password.js
 * Description: This launches a popup window, if the
 * wrong password is provided.
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
    document.getElementById("tryAgain").addEventListener("click", async () => {
      let win = await messenger.windows.getCurrent();
      await messenger.windows.remove(win.id);
      messenger.runtime.sendMessage({ retryDecryption: true });
    });
  
    document.getElementById("cancel").addEventListener("click", async () => {
      let win = await messenger.windows.getCurrent();
      await messenger.windows.remove(win.id);
      messenger.runtime.sendMessage({ retryDecryption: false });
    });
  });
  