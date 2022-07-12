var user = prompt("Please enter a secure password or phrase (the longer the better): ");
if (user != null) {
    document.getElementById("greeting").innerHTML = "Greetings, " + user + "!";
}