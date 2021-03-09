const uuid = require("uuid");

exports.handler = async (event, context, callback) => {
  // console.log("event:", JSON.stringify(event, null, 4));
  // console.log("context", JSON.stringify(context, null, 4));
  const cId = event.request.userAttributes["custom:cId"] || uuid.v4();
  const eId = event.request.userAttributes["custom:eId"] || uuid.v4();
  const roles = event.request.userAttributes["custom:roles"] || "Owner";
  // Transform a comma seperated list of roles into an arry of
  // roles, plues appened the cId to each. Ex: Owner becomes [Owner-cId]
  const groupsToOverride = roles.split(",").reduce((accum, curr) => {
    accum[accum.length] = `${curr.trim()}-${cId}`;
    return accum;
  }, []);

  const newAccount = !event.request.userAttributes["custom:cId"] || undefined;
  const { groupConfiguration } = event.request;

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        cId,
        eId,
        newAccount, // Only present on first login
      },
      // claimsToSuppress: ['attribute_key3'],
      groupOverrideDetails: {
        groupsToOverride,
        iamRolesToOverride: groupConfiguration.iamRolesToOverride,
        preferredRole: groupConfiguration.preferredRole,
      },
    },
  };
  // console.log("post event:", JSON.stringify(event, null, 4));
  // Return to Amazon Cognito
  callback(null, event);
};