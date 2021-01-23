/* Amplify Params - DO NOT EDIT
	API_ITIEMPO_GRAPHQLAPIENDPOINTOUTPUT
	API_ITIEMPO_GRAPHQLAPIIDOUTPUT
	AUTH_AUTH_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
/**
 * Get user pool information from environment variables.
 */
const COGNITO_USERPOOL_ID = process.env.AUTH_AUTH_USERPOOLID;
if (!COGNITO_USERPOOL_ID) {
  throw new Error(
    `Function requires environment variable: 'COGNITO_USERPOOL_ID'`
  );
}

const createUser = async (
  Username,
  UserAttributes = [],
  ClientMetadata = {}
) => {
  const params = {
    UserPoolId: COGNITO_USERPOOL_ID /* required */,
    Username,
    UserAttributes,
    ClientMetadata,
  };
  try {
    return await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise();
  } catch (e) {
    throw e;
  }
};

const addUserToGroup = async (Username, GroupName) => {
  const params = {
    GroupName,
    UserPoolId: COGNITO_USERPOOL_ID,
    Username,
  };
  try {
    return await cognitoIdentityServiceProvider
      .adminAddUserToGroup(params)
      .promise();
  } catch (e) {
    throw e;
  }
};

const removeUserFromGroup = async (Username, GroupName) => {
  const params = {
    GroupName,
    UserPoolId: COGNITO_USERPOOL_ID,
    Username,
  };
  try {
    return await cognitoIdentityServiceProvider
      .adminRemoveUserFromGroup(params)
      .promise();
  } catch (e) {
    throw e;
  }
};

const listUserGroups = async (Username) => {
  const params = {
    UserPoolId: COGNITO_USERPOOL_ID,
    Username,
    Limit: 25,
  };
  try {
    const {
      Groups,
    } = await cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise();
    return Groups.map((v) => v.GroupName);
  } catch (e) {
    throw e;
  }
};

const updateUser = async (
  Username,
  UserAttributes = [],
  ClientMetadata = {}
) => {
  const params = {
    UserPoolId: COGNITO_USERPOOL_ID,
    Username,
    UserAttributes,
    ClientMetadata,
  };
  try {
    return await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
      .promise();
  } catch (e) {
    throw e;
  }
};

/**
 * 
 * @param {*} CustomAttributes "CustomAttributes": [ 
      { 
         "AttributeDataType": "string",
         "DeveloperOnlyAttribute": boolean,
         "Mutable": boolean,
         "Name": "string",
         "NumberAttributeConstraints": { 
            "MaxValue": "string",
            "MinValue": "string"
         },
         "Required": boolean,
         "StringAttributeConstraints": { 
            "MaxLength": "string",
            "MinLength": "string"
         }
      }
   ]
 */
const addCustomAttributes = async (CustomAttributes) => {
  const params = {
    CustomAttributes,
    UserPoolId: COGNITO_USERPOOL_ID,
  };
  try {
    return await cognitoIdentityServiceProvider
      .addCustomAttributes(params)
      .promise();
  } catch (e) {
    throw e;
  }
};
/**
 *
 * @param {*} Username
 */
const getUser = async (Username) => {
  const params = {
    Username,
    UserPoolId: COGNITO_USERPOOL_ID,
  };
  try {
    return await cognitoIdentityServiceProvider.adminGetUser(params).promise();
  } catch (e) {
    throw e;
  }
};
/**
 *
 * @param {*} Username
 */
const globalSignOut = async (Username) => {
  const params = {
    Username,
    UserPoolId: COGNITO_USERPOOL_ID,
  };
  try {
    return await cognitoIdentityServiceProvider
      .adminUserGlobalSignOut(params)
      .promise();
  } catch (e) {
    throw e;
  }
};

exports.getUser = getUser;
exports.createUser = createUser;
exports.addUserToGroup = addUserToGroup;
exports.removeUserFromGroup = removeUserFromGroup;
exports.listUserGroups = listUserGroups;
exports.updateUser = updateUser;
exports.addCustomAttributes = addCustomAttributes;
exports.globalSignOut = globalSignOut;
