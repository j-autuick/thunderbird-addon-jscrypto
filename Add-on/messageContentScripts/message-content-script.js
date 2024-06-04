console.log("hello from inside the content script.");

//we get inside the function, but then get an uncaught exception error.
async function testingMaterial() {
  console.log("We are inside the content-script showBanner")




  let homies = await browser.runtime.sendMessage({
    command: "sayHi",
  })
  const myBody = document.body;
  const { text } = homies;
  homies.innerText = text;

  //this fails, because I need to get the tab.
  //this works! gets the body and replaces it.
  //let myBody = document.body;
  //console.log("Does this junk work? " + myBody.innerHTML);
  
  //this works! gets the body and replaces it.
  console.log("Hello, inside content script.");
  console.log("Does this junk work? " + myBody.innerHTML);
  var twinBody = myBody.innerHTML = newBody;
  notificationText.innerText = twinBody;  

  // and insert it as the very first element in the message
  document.body.insertBefore(notification, document.body.firstChild);


  
};

// content.js
browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let tabId = tabs[0].id;
  console.log("Tab ID in content script:", tabId);

  // You can now use the tabId as needed in your content script
});

testingMaterial();