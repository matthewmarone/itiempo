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

/**
 *
 * @returns
 */
const sendEmail = async () => {
  // Create sendEmail params
  var params = {
    Destination: {
      ToAddresses: [
        "mattmarone@itiempo.com",
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "HTML_FORMAT_BODY",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Testing Amazon SES.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Test email",
      },
    },
    Source: "mattmarone@itiempo.com" /* required */,
    ReplyToAddresses: [
      "mattmarone@itiempo.com",
      /* more items */
    ],
  };

  // Create the promise and SES service object
  return await new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
};

exports.sendEmail = sendEmail;
