const showBanner = async () => {
    let bannerDetails = await browser.runtime.sendMessage({
      command: "getBannerDetails",
    });
  
    // get the details back from the formerly serialized content
    const { text } = bannerDetails;
  
    // create the banner element itself
    const banner = document.createElement("div");
    banner.className = "thunderbirdMessageDisplayActionExample";
  
    // create the banner text element
    const bannerText = document.createElement("div");
    bannerText.className = "thunderbirdMessageDisplayActionExample_Text";
    bannerText.innerText = text;
  
    // create a button to display it in the banner
    const markUnreadButton = document.createElement("button");
    markUnreadButton.innerText = "Mark unread";
    markUnreadButton.addEventListener("click", async () => {
      // add the button event handler to send the command to the background script
      browser.runtime.sendMessage({
        command: "markUnread",
      });
    });
  
    // add text and button to the banner
    banner.appendChild(bannerText);
    banner.appendChild(markUnreadButton);
  
    // and insert it as the very first element in the message
    document.body.insertBefore(banner, document.body.firstChild);
  };
  
  showBanner();