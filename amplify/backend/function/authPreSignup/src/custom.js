exports.handler = (event, context, callback) => {
  // Auto confirm user (this does not verify their email), but
  // does allow the user to immediately login without the need
  // to verify first by sending an auth code by email
  event.response.autoConfirmUser = true;
  // Set the email as verified if it is in the request
  // We are going to be cowboy's here, and make our lives
  // easier and assume that the user would give us a vaild
  // email.
  if (event.request.userAttributes.hasOwnProperty("email")) {
    event.response.autoVerifyEmail = true;
  }

  callback(null, event);
};
