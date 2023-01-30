// const showNotification = async () => {
//   let notificationDetails = await browser.runtime.sendMessage({
//     command: "getNotificationDetails",
//   });
//   // change name of notificationDetails to something more useful
//   const { text } = notificationDetails;
//   notificationText.innerText = text;

//   //this works! gets the body and replaces it.
//   console.log("Hello, inside content script.");
//   const myBody = document.body;
//   console.log("Does this junk work? " + myBody.innerHTML);
//   var twinBody = myBody.innerHTML = newBody;
//   notificationText.innerText = twinBody;  

//   // and insert it as the very first element in the message
//   document.body.insertBefore(notification, document.body.firstChild);
// };

// showNotification();

//so far, we never get jack shit from this page?!?
console.log("hello from inside the content script.");

// function handleResponse(message) {
//   //console.log(`Message from the background script: ${message.response}`);
//   console.log("message from background " + message);
//   console.log("Message from the background script: yo");
// }

// function handleError(error) {
//   //console.log(`Error: ${error}`);
//   console.log("Error eject!");
// }

// function notifyBackgroundPage(e) {
//   const sending = browser.runtime.sendMessage({
//     greeting: "Greeting from the content script",
//   });
//   sending.then(handleResponse, handleError);
// }

// //note to self, this works by itself
// //notifyBackgroundPage();
// window.addEventListener("onchange", notifyBackgroundPage);

async function showBanner() {
  // let bannerDetails = await browser.runtime.sendMessage({
  //     command: "getBannerDetails",
  // });

  //test, say hello
  let homies = await browser.runtime.sendMessage({
    command: "sayHi",
  })
  const { text } = homies;
  homies.innerText = text;

  
  // //this works! gets the body and replaces it.
  // let myBody = document.body;
  // console.log("Does this junk work? " + myBody.innerHTML);
  
  


  

  // // Get the details back from the formerly serialized content.
  // const { text } = bannerDetails;

  // // Create the banner element itself.
  // const banner = document.createElement("div");
  // banner.className = "thunderbirdMessageDisplayActionExample";

  // // Create the banner text element.
  // const bannerText = document.createElement("div");
  // bannerText.className = "thunderbirdMessageDisplayActionExample_Text";
  // bannerText.innerText = text;

  // // Create a button to display it in the banner.
  // const markUnreadButton = document.createElement("button");
  // markUnreadButton.innerText = "Mark unread";
  // markUnreadButton.addEventListener("click", async () => {
  //     // Add the button event handler to send the command to the
  //     // background script.
  //     browser.runtime.sendMessage({
  //         command: "markUnread",
  //     });
  //});

  // // Add text and button to the banner.
  // banner.appendChild(bannerText);
  // banner.appendChild(markUnreadButton);

  // // Insert it as the very first element in the message.
  // document.body.insertBefore(banner, document.body.firstChild);
};

showBanner();
