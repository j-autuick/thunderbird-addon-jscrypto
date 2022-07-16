var plaintext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

console.log(plaintext);

var Crypt = new Crypt();

var key = "PasswordText";

var encryptedText = Crypto.AES.encrypt(plaintext, key);

console.log("Encrypted Text: " + encryptedText.toString());

var decryptedText = Crypto.AES.decrypt(encryptedText, key);

console.log("Decrypted Text: " + decryptedText);