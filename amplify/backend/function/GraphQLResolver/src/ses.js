/* Amplify Params - DO NOT EDIT
	API_ITIEMPO_GRAPHQLAPIENDPOINTOUTPUT
	API_ITIEMPO_GRAPHQLAPIIDOUTPUT
	AUTH_USERS_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: process.env.REGION });

const sendPasswordRestEmail = async (email, password, firstName) => {
  // Create sendEmail params
  var params = {
    Destination: {
      ToAddresses: [
        email,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `Hello ${firstName}, 
          <br /><br />
          Your iTiempo account has been re-set, and your temporary password is: <strong>${password}</strong> .
          Go to <a href="https://app.itiempo.com">iTiempo.com</a> to login with 
          your temporary password and create a new one.
          <br /><br />
          Have a great day,
          <br /><br />
          iTiempo!
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Hello ${firstName}, 
          

          Your iTiempo account has been re-set, and your temporary password is: ${password} .  Go to https://app.iTiempo.com to login with your temporary password and create a new one.
          

          Have a great day,
          

          iTiempo!
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Your password has been changed",
      },
    },
    Source: "noreply@iTiempo.com" /* required */,
    ReplyToAddresses: [
      "noreply@iTiempo.com",
      /* more items */
    ],
  };
  console.log("sending email: ", JSON.stringify(params, null, 4));
  return await sendEmail(params);
};

/**
 *
 * @returns
 */
const sendEmail = (params) => {
  // Create the promise and SES service object
  return new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();
};

exports.sendPasswordRestEmail = sendPasswordRestEmail;
