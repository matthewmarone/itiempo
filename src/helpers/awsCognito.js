export const getUserName = (CognitoUser = {}) => {
  return CognitoUser.username;
};

export const getClaim = (CognitoUser = {}, attribute) => {
  if (
    CognitoUser.signInUserSession &&
    CognitoUser.signInUserSession.idToken &&
    CognitoUser.signInUserSession.idToken.payload
  ) {
    return CognitoUser.signInUserSession.idToken.payload[attribute];
  }
  return null;
};

export const getAttribute = (CognitoUser = {}, attribute) => {
  if (CognitoUser.attributes) {
    return CognitoUser.attributes[attribute];
  }
  return null;
};

/**
 *
 * @param {*} password
 * @returns
 */
export const isValidPassword = (password) =>
  (typeof password === "string" || password instanceof String) &&
  password &&
  password.length > 7;
/**
 *
 * @returns
 */
export const createTemporaryPassword = () =>
  Math.random().toString(36).substring(2, 10);
