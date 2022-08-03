// code is originally from: https://www.aspsnippets.com/Articles/Enable-or-Disable-Button-based-on-condition-using-JavaScript.aspx
// used for testing purposes.

//purpose for this code is to get an idea of how to make a button
//to be activated in case an encrypted message is received.

function EnableDisable(txtPassportNumber) {
    //Reference the Button.
    var btnSubmit = document.getElementById("btnSubmit");

    //Verify the TextBox value.
    if (txtPassportNumber.value.trim() != "") {
        //Enable the TextBox when TextBox has value.
        btnSubmit.disabled = false;
    } else {
        //Disable the TextBox when TextBox is empty.
        btnSubmit.disabled = true;
    }
};

//This is just thrown in, since I think it might be useful code snippet:
//Got this from Mdn web docs (Mozilla): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }
  
  async function asyncCall() {
    console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
    // expected output: "resolved"
  }
  
  asyncCall();
  
