import React, { createContext, useReducer } from "react";
import Reducer from "Reducer";
import { I18n } from "aws-amplify";
import { dict } from "I18n";

const lang = "en";
I18n.putVocabularies(dict);
I18n.setLanguage(lang);

/**
 *
 */
export const initialState = {
  user: null,
  userLocalAppData: { accountSetup: false },
  lang,
  disableI18n: true,
};

/**
 *
 * @param {*} param0
 */
const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

/**
 *
 */
export const Context = createContext(initialState);
export default AppStateProvider;
