import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import AppAuthenticator from "AppAuthenticator";
import theme from "theme";
import AppStateProvider from "Store";
import { SnackbarProvider } from "notistack";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import Routes from "Routes";
import Amplify, { Auth, Logger } from "aws-amplify";
import awsconfig from "aws-exports";
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import "./assets/scss/index.scss";
import "react-perfect-scrollbar/dist/css/styles.css";
import { mergeSortedLists } from "helpers";

Amplify.configure(awsconfig);
Logger.LOG_LEVEL = "VERBOSE";
// eslint-disable-next-line
const logger = new Logger("App.js", "ERROR");

const browserHistory = createBrowserHistory();

const url = awsconfig.aws_appsync_graphqlEndpoint;
const region = awsconfig.aws_appsync_region;
const auth = {
  type: awsconfig.aws_appsync_authenticationType,
  jwtToken: async () =>
    (await Auth.currentSession()).getIdToken().getJwtToken(),
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }),
]);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        listEmployeeTimeRecords: {
          keyArgs: ["employeeId"],
          read(
            existing,
            { args: { sortDirection, timestampIn, ...r }, readField }
          ) {
            logger.debug(
              "listEmployeeTimeRecords Policy (Read)",
              existing,
              sortDirection,
              timestampIn,
              r
            );
            if (sortDirection !== "DESC") {
              logger.error(
                "Time Records must always be queried in DESC order."
              );
              return undefined;
            } else if (existing && timestampIn) {
              // We have data and a timestamp filter to filter
              const { items } = existing;

              if (!items) return existing; // Could be an error obj

              const filteredItems = items.filter((value) => {
                const v = readField("timestampIn", value);
                const { between, gt, ge, lt, le, eq } = timestampIn;
                let satisfies = true;
                if (satisfies && between) {
                  const [gTe, lTe] = between.sort();
                  satisfies = v >= gTe && v <= lTe;
                }
                if (satisfies && gt) satisfies = v > gt;
                if (satisfies && ge) satisfies = v >= ge;
                if (satisfies && lt) satisfies = v < lt;
                if (satisfies && le) satisfies = v <= le;
                if (satisfies && eq) satisfies = v === eq;
                return satisfies;
              });
              return { ...existing, items: filteredItems };
            } else {
              logger.debug(
                "listEmployeeTimeRecords Policy (Read)",
                "Returning unfiltered"
              );
              return existing;
            }
          },
          merge(existing, incoming, { args: { sortDirection }, readField }) {
            logger.debug(
              "listEmployeeTimeRecords Policy (Merge)",
              existing,
              incoming,
              sortDirection
            );
            if (sortDirection !== "DESC") {
              logger.error(
                "Time Records must always be queried in DESC order."
              );
              return undefined;
            } else {
              const { items: existingItems } = existing || {};
              const { items: incomingItems } = incoming || {};
              if (existingItems && incomingItems) {
                const itemsCombined = mergeSortedLists(
                  existingItems,
                  incomingItems,
                  (ref1, ref2) => {
                    const t1 = readField("timestampIn", ref1);
                    const t2 = readField("timestampIn", ref2);
                    return t1 === t2 ? 0 : t1 < t2 ? -1 : 1;
                  },
                  false
                );
                return { ...incoming, items: itemsCombined };
              } else {
                return incomingItems ? incoming : existing;
              }
            }
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link,
  cache,
  name: "iTiempo-react-web-client",
  version: "1.0",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// export const awsAppSyncClient = new AWSAppSyncClient({
//   url: awsconfig.aws_appsync_graphqlEndpoint,
//   region: awsconfig.aws_appsync_region,
//   auth: {
//     type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
//     jwtToken: async () =>
//       (await Auth.currentSession()).getIdToken().getJwtToken(),
//   },
//   complexObjectsCredentials: () => Auth.currentCredentials(),
//   cacheOptions: {
//     cacheRedirects: {
//       Query: {
//         getEmployee: (_, args, { getCacheKey }) => {
//           return getCacheKey({ __typename: "Employee", id: args.id });
//         },
//       },
//     },
//     onError: (errorObj) => {
//       logger.error("Appsync Client Error", errorObj);
//       const { response } = errorObj;
//       if (errorObj) response.errors = null;
//     },
//   },
// });

const App = () => {
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
