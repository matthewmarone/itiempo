import React, { createContext, useReducer } from "react";
import Reducer from "Reducer";

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

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

/**
 *
 */
export const Context = createContext(initialState);
export default AppStateProvider;
