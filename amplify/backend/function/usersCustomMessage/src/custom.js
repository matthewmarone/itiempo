// CustomMessage_SignUp	Custom message – To send the confirmation code post sign-up.
// CustomMessage_AdminCreateUser	Custom message – To send the temporary password to a new user.
// CustomMessage_ResendCode	Custom message – To resend the confirmation code to an existing user.
// CustomMessage_ForgotPassword	Custom message – To send the confirmation code for Forgot Password request.
// CustomMessage_UpdateUserAttribute	Custom message – When a user's email or phone number is changed, this trigger sends a verification code automatically to the user. Cannot be used for other attributes.
// CustomMessage_VerifyUserAttribute	Custom message – This trigger sends a verification code to the user when they manually request it for a new email or phone number.
// CustomMessage_Authentication	Custom message – To send MFA code during authentication.

exports.handler = (event, context, callback) => {
  if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    // Custom message – To send the temporary password to a new user.
    // Ensure that your message contains event.request.codeParameter and
    // event.request.usernameParameter. This is the placeholder for the code
    // and username that will be sent to your user.
    event.response.smsMessage =
      "Welcome to iTiempo! Your user name is " +
      event.request.usernameParameter +
      " Your temporary password is " +
      event.request.codeParameter;

    const { name = "" } = event.request.clientMetadata || {};

    event.response.emailSubject = "Welcome to iTiempo!";
    event.response.emailMessage = `Hello ${name},<br ><br />
    Welcome to iTiempo!  An account has been setup for you.<br /><br />
    Your user name is: ${event.request.usernameParameter}<br />
    Your temporary password is: ${event.request.codeParameter}<br />
    <br />
    Go to <a href="https://app.itiempo.com">iTiempo.com</a> and login with your temporary password to finish setting up your new account.
    <br /><br />
    Have a great day,
    <br /><br />
    iTiempo
    `;
  } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
    // Custom message – To send the confirmation code for Forgot Password request.
    event.response.smsMessage =
      " Your temporary password is " + event.request.codeParameter;

    event.response.emailSubject = "Password Recovery";
    event.response.emailMessage = `Let's get you logged back in!  
    Your temporary code is: <strong>${event.request.codeParameter}</strong><br />
    <br /><br />
    Have a great day,
    <br /><br />
    iTiempo!
    `;
  }
  // Create custom message for other events

  // Return to Amazon Cognito
  callback(null, event);
};
