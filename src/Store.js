import React, { createContext, useReducer } from "react";
import Reducer from "Reducer";
import { Logger } from "aws-amplify";
// eslint-disable-next-line
const logger = new Logger("Store.js", "ERROR");

/**
 *
 */
export const initialState = {
  user: null,
  userLocalAppData: { accountSetup: false },
};

/**
 *
 * @param {*} param0
 */
const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  logger.debug("AppContext => ", state);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

/**
 *
 */
export const Context = createContext(initialState);
export default AppStateProvider;
