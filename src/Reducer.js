import { initialState } from "Store";
import { I18n } from "aws-amplify";

export const AppActions = {
  SET_USER: "SET_USER",
  UPDATE_LOCAL_APP_DATA: "UPDATE_LOCAL_APP_DATA",
  CLEAR_CONTEXT: "CLEAR_CONTEXT",
  CHANGE_LANG: "CHANGE_LANG",
};

const Reducer = (state, action) => {
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
        console.warn(e);
      }
      return {
        ...state,
        user: {
          companyId,
          employeeId,
          email,
          emailVerified,
          roles: Array.isArray(roles)
            ? roles.reduce((ret, v) => {
                // Ex: Owner-6313cc05-5b6f-48fd-a0ca-6a4e30e06354
                if (v?.includes(`-${companyId}`))
                  ret[ret.length] = v.split(`-${companyId}`)[0];
                return ret;
              }, [])
            : ["Employee"],
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
        console.warn(e);
      }
      return {
        ...state,
        userLocalAppData,
      };
    case AppActions.CLEAR_CONTEXT:
      return initialState;
    case AppActions.CHANGE_LANG:
      const { lang } = action.payload;
      I18n.setLanguage(lang);
      return {
        ...state,
        lang,
      };
    default:
      console.warn("Action Type not implemented");
      return state;
  }
};

export default Reducer;
