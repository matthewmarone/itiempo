exports.handler = (event, context, callback) => {
  // Identify why was this function invoked
  if (event.triggerSource === "CustomMessage_SignUp") {
    // Custom message – To send the confirmation code post sign-up.

    // Ensure that your message contains event.request.codeParameter.
    // This is the placeholder for code that will be sent
    event.response.smsMessage =
      "Welcome to iTiempo. Your confirmation code is " +
      event.request.codeParameter;
    event.response.emailSubject = "Welcome to iTiempo!";
    event.response.emailMessage =
      "Thank you for signing up for iTiempo, your confirmation code is: " +
      event.request.codeParameter;
  } else if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    // Custom message – To send the temporary password to a new user.

    // Ensure that your message contains event.request.codeParameter and
    // event.request.usernameParameter. This is the placeholder for the code
    // and username that will be sent to your user.
    event.response.smsMessage =
      "Welcome to iTiempo! Your user name is " +
      event.request.usernameParameter +
      " Your temporary password is " +
      event.request.codeParameter;
    event.response.emailSubject = "Welcome to iTiempo!";
    event.response.emailMessage = `Welcome to iTiempo! Your manager has set up a new account for you.
    Your user name is: ${event.request.usernameParameter}
    Your temporary password is: ${event.request.codeParameter}

    Go to <a href="https://app.itiempo.com">iTiempo.com</a> and login with your temporary password to finish setting up your account.

    Have a great day!
    `;
  } else if (event.triggerSource === "CustomMessage_ResendCode") {
    // Custom message – To resend the confirmation code to an existing user.
  } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
    // Custom message – To send the confirmation code for Forgot Password request.
  } else if (event.triggerSource === "CustomMessage_UpdateUserAttribute") {
    // Custom message – When a user's email or phone number is changed,
    // this trigger sends a verification code automatically to the user.
    // Cannot be used for other attributes.
  } else if (event.triggerSource === "CustomMessage_VerifyUserAttribute") {
    // Custom message – This trigger sends a verification code to the user when
    // they manually request it for a new email or phone number.
  } else if (event.triggerSource === "CustomMessage_Authentication") {
    // Custom message – To send MFA code during authentication.
  }
  // Create custom message for other events

  // Return to Amazon Cognito
  callback(null, event);
};
