/* eslint-disable-line */ const aws = require("aws-sdk");

exports.handler = async (event, context, callback) => {
  const group = "Founders";
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider(
    { apiVersion: "2016-04-18" }
  );
  const groupParams = {
    GroupName: group,
    UserPoolId: event.userPoolId,
  };

  const addUserParams = {
    GroupName: group,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }

  try {
    await cognitoidentityserviceprovider
      .adminAddUserToGroup(addUserParams)
      .promise();
    callback(null, event);
  } catch (e) {
    callback(e);
  }
};
