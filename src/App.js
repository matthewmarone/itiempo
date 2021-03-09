import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import AppAuthenticator from "AppAuthenticator";
import theme from "theme";
import AppStateProvider from "Store";
import { SnackbarProvider } from "notistack";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import Routes from "Routes";
import Amplify, { Logger } from "aws-amplify";
import awsconfig from "aws-exports";
import { ApolloProvider } from "@apollo/client";
import "./assets/scss/index.scss";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useApolloClient } from "./use-apollo-client";

Amplify.configure(awsconfig);
Logger.LOG_LEVEL = "VERBOSE";
// eslint-disable-next-line
const logger = new Logger("App.js", "ERROR");

const browserHistory = createBrowserHistory();

const App = () => {
  const client = useApolloClient(awsconfig);
  return (
    <AppStateProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <ApolloProvider client={client}>
            <AppAuthenticator data-testid="did-load-test">
              <Router history={browserHistory}>
                <Routes />
              </Router>
            </AppAuthenticator>
          </ApolloProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </AppStateProvider>
  );
};

export default App;
