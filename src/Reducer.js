import { Logger } from "aws-amplify";
import { initialState } from "Store";

const logger = new Logger("Reducer.js", "ERROR");

export const AppActions = {
  SET_USER: "SET_USER",
  UPDATE_LOCAL_APP_DATA: "UPDATE_LOCAL_APP_DATA",
  CLEAR_CONTEXT: "CLEAR_CONTEXT",
};

const Reducer = (state, action) => {
  logger.debug("Dispatch action", action);
  switch (action.type) {
    case AppActions.SET_USER:
      const {
        cId: companyId,
        eId: employeeId,
        email,
        email_verified: emailVerified,
        "cognito:groups": roles,
        "cognito:username": username,
        newAccount,
      } = action.payload;
      try {
        localStorage.setItem("itiempo.ac", JSON.stringify([companyId]));
      } catch (e) {
        logger.warn(e);
      }
      return {
        ...state,
        user: {
          companyId,
          employeeId,
          email,
          emailVerified,
          roles,
          username,
          newAccount,
        },
        userLocalAppData: JSON.parse(localStorage.getItem(username) || "{}"),
      };
    case AppActions.UPDATE_LOCAL_APP_DATA:
      const { username: un } = state.user || {};
      const ls = JSON.parse(localStorage.getItem(un) || "{}");
      const userLocalAppData = { ...ls, ...action.payload };
      try {
        localStorage.setItem(un, JSON.stringify(userLocalAppData));
      } catch (e) {
        logger.warn(e);
      }
      return {
        ...state,
        userLocalAppData,
      };
    case AppActions.CLEAR_CONTEXT:
      return initialState;
    default:
      logger.warn("Action Type not implemented");
      return state;
  }
};

export default Reducer;
