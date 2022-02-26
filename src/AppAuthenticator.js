import React, { useState, useEffect, useContext, useCallback } from "react";
import { Context } from "Store";
import { AppActions } from "Reducer";
import { Hub, Auth } from "aws-amplify";
import { useApolloClient } from "@apollo/client";
import {
  SignIn,
  SignUp,
  ForgotPassword,
  NewPasswordRequired,
  AuthNLoading,
  WelcomeNewAccount,
} from "views";

/**
 *
 */
const UIAuthState = {
  SignUp: "signup",
  SignOut: "signout",
  SignIn: "signin",
  Loading: "loading",
  SignedOut: "signedout",
  SignedIn: "signedin",
  SigningUp: "signingup",
  NewPasswordRequired: "newpasswordrequired",
  ConfirmSignUp: "confirmSignUp",
  confirmingSignUpCustomFlow: "confirmsignupcustomflow",
  ConfirmSignIn: "confirmSignIn",
  confirmingSignInCustomFlow: "confirmingsignincustomflow",
  VerifyingAttributes: "verifyingattributes",
  ForgotPassword: "forgotpassword",
  ResetPassword: "resettingpassword",
  SettingMFA: "settingMFA",
  TOTPSetup: "TOTPSetup",
  CustomConfirmSignIn: "customConfirmSignIn",
  VerifyContact: "verifyContact",
  WelcomeNewUser: "welcomeNewUser",
};

/**
 *
 * @param {*} param0
 */
const AppAuthenticator = ({ children }) => {
  const [authState, setAuthState] = useState(UIAuthState.Loading);
  const [authData, setAuthData] = useState({});
  const [authorized, setAuthorized] = useState(false);
  const [{ user }, dispatch] = useContext(Context);
  const client = useApolloClient();

  /**
   *
   * @param {*} param0
   */
  const goToAppOrWelcomeNewUser = useCallback(
    ({ newAccount, eId, "cognito:username": username }) => {
      // The newAccount claim is present the first time a new account logs in
      // BUT because this claim is stored locally until it is refreshed on the device by Amplify Cognito
      // there is the chance that if the user hits refresh the program will not be aware
      // that it has already displayed the WelcomeNewUser page.  To fix this we store an accountSetup
      // flag on the device to indicate that WelcomeNewUser has already completed.
      const { accountSetup } = JSON.parse(
        localStorage.getItem(username) || "{}"
      );
      !newAccount || !!accountSetup
        ? setAuthState(UIAuthState.SignedIn)
        : setAuthState(UIAuthState.WelcomeNewUser);
    },
    []
  );

  // Check to see if the user already is logged in
  useEffect(() => {
    Auth.currentSession()
      .then(({ idToken: { payload } }) => {
        dispatch({ type: AppActions.SET_USER, payload });
        goToAppOrWelcomeNewUser(payload);
      })
      .catch((e) => {
        setAuthState(
          window?.location?.search?.includes("signup=true")
            ? UIAuthState.SignUp
            : UIAuthState.SignIn
        ); // Back to signin page
        if (e !== "No current user") console.error(e);
      });
  }, [dispatch, goToAppOrWelcomeNewUser]);

  // Listen for AWS Cognito events
  const hubListener = useCallback(
    (data) => {
      switch (data.payload.event) {
        case "signIn":
          const { payload } = data.payload.data.signInUserSession.idToken;
          dispatch({ type: AppActions.SET_USER, payload });
          goToAppOrWelcomeNewUser(payload);
          break;
        case "signUp":
          break;
        case "signOut":
          dispatch({ type: AppActions.CLEAR_CONTEXT });
          setAuthState(UIAuthState.SignIn); // Back to signin page
          break;
        case "signIn_failure":
          break;
        case "configured":
          break;
        default:
          console.warn("Unimplemented event: " + data.payload.event, data);
      }
    },
    [dispatch, goToAppOrWelcomeNewUser]
  );
  // Setup Congnito listener
  useEffect(() => {
    return Hub.listen("auth", hubListener);
  }, [hubListener]);

  // These auth state changes happen through UI interactions only
  const handleAuthStateChange = useCallback((nextAuthState, authData) => {
    setAuthState(nextAuthState);
    setAuthData(authData);
  }, []);

  // The different views to show depending on auth state
  const viewSwitch = useCallback(
    (uiState) => {
      switch (uiState) {
        case UIAuthState.Loading:
          return <AuthNLoading />;
        case UIAuthState.SignUp:
          return (
            <SignUp
              authData={authData}
              onAuthStateChange={handleAuthStateChange}
            />
          );
        case UIAuthState.ForgotPassword:
          return (
            <ForgotPassword
              authData={authData}
              onAuthStateChange={handleAuthStateChange}
            />
          );
        case UIAuthState.NewPasswordRequired:
          return (
            <NewPasswordRequired
              authData={authData}
              onAuthStateChange={handleAuthStateChange}
            />
          );
        case UIAuthState.WelcomeNewUser:
          return (
            <WelcomeNewAccount
              authData={authData}
              onAuthStateChange={handleAuthStateChange}
            />
          );
        case UIAuthState.SignIn:
        default:
          return (
            <SignIn
              authData={authData}
              onAuthStateChange={handleAuthStateChange}
            />
          );
      }
    },
    [authData, handleAuthStateChange]
  );

  const isAuthorized = authState === UIAuthState.SignedIn && user;
  useEffect(() => {
    if (isAuthorized) {
      // Check that it's the same user as last time
      // Otherwise reset the store, fresh for the new user,
      // and set this user to the last logged in user
      const key = "preuser";
      const { username } = user;
      const preUsername = localStorage.getItem(key);
      if (preUsername !== username) {
        client
          .resetStore()
          .then(() => console.log("Reset Store for new user"))
          .catch((e) => console.error(e))
          .finally(() => setAuthorized(true));
        try {
          localStorage.setItem(key, username);
        } catch (e) {
          console.error(e);
        }
      } else {
        setAuthorized(true);
      }
    } else {
      setAuthorized(false);
    }
  }, [isAuthorized, client, user]);

  return authorized ? (
    children
  ) : !isAuthorized ? (
    viewSwitch(authState)
  ) : (
    <AuthNLoading />
  );
};

export { UIAuthState };
export default AppAuthenticator;
