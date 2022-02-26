import React from "react";
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { Auth } from "aws-amplify";
import { AUTH_TYPE, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { mergeSortedLists } from "helpers";

/**
 *
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        keyArgs: false,
        timeRecordReport: {
          read(existing, { args: { filter }, readField }) {
            if (existing) {
              const { from, to } = filter;
              // We have data and a timestamp filter to filter
              const { items } = existing;

              if (!items) return existing; // Could be an error obj

              const filteredItems = items.filter((value) => {
                const clockIn = readField("timestampIn", value);
                const _deleted = readField("_deleted", value);
                return !_deleted && clockIn >= from && clockIn <= to;
              });
              return { ...existing, items: filteredItems };
            } else {
              return existing;
            }
          },
          merge(existing, incoming, { readField }) {
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
          },
        },
        listEmployeeTimeRecords: {
          keyArgs: ["employeeId"],
          read(
            existing,
            { args: { sortDirection, timestampIn, ...r }, readField }
          ) {
            if (sortDirection !== "DESC") {
              console.error(
                "Time Records must always be queried in DESC order."
              );
              return undefined;
            } else if (existing) {
              // We have data and a timestamp filter to filter
              const { items } = existing;

              if (!items) return existing; // Could be an error obj

              const filteredItems = items.filter((value) => {
                const _deleted = readField("_deleted", value);
                let satisfies = !_deleted;
                if (timestampIn && satisfies) {
                  const v = readField("timestampIn", value);
                  const { between, gt, ge, lt, le, eq } = timestampIn;
                  if (satisfies && between) {
                    const [gTe, lTe] = between.sort();
                    satisfies = v >= gTe && v <= lTe;
                  }
                  if (satisfies && gt) satisfies = v > gt;
                  if (satisfies && ge) satisfies = v >= ge;
                  if (satisfies && lt) satisfies = v < lt;
                  if (satisfies && le) satisfies = v <= le;
                  if (satisfies && eq) satisfies = v === eq;
                }
                return satisfies;
              });
              return { ...existing, items: filteredItems };
            } else {
              return existing;
            }
          },
          merge(existing, incoming, { args: { sortDirection }, readField }) {
            if (sortDirection !== "DESC") {
              console.error(
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
        listEmployeesByEmail: {
          // In the future we could maintain a single list, regardless of sort
          keyArgs: ["companyId", "sortDirection"],
          read(existing, { readField }) {
            if (existing) {
              // We have data and a timestamp filter to filter
              const { items } = existing;

              if (!items) return existing; // Could be an error obj

              const filteredItems = items.filter(
                (value) => !readField("_deleted", value)
              );
              return { ...existing, items: filteredItems };
            } else {
              return existing;
            }
          },
          merge(existing, incoming, { args: { sortDirection }, readField }) {
            const { items: existingItems } = existing || {};
            const { items: incomingItems } = incoming || {};
            if (existingItems && incomingItems) {
              const itemsCombined = mergeSortedLists(
                existingItems,
                incomingItems,
                (ref1, ref2) => {
                  const t1 = readField("email", ref1);
                  const t2 = readField("email", ref2);
                  return t1 === t2 ? 0 : t1 < t2 ? -1 : 1;
                },
                sortDirection === "ASC"
              );
              return { ...incoming, items: itemsCombined };
            } else {
              return incomingItems ? incoming : existing;
            }
          },
        },
      },
    },
  },
});

/**
 *
 * @param {*} appSyncConfig
 */
const createApolloClient = (appSyncConfig) => {
  const url = appSyncConfig.aws_appsync_graphqlEndpoint;
  const region = appSyncConfig.aws_appsync_region;
  const cognitoAuth = {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
  };
  const cognitoLink = ApolloLink.from([
    createAuthLink({ url, region, auth: cognitoAuth }),
    createSubscriptionHandshakeLink({ url, region, auth: cognitoAuth }),
  ]);
  const iamAuth = {
    type: AUTH_TYPE.AWS_IAM,
    credentials: async () => await Auth.currentCredentials(),
  };
  const iamLink = ApolloLink.from([
    createAuthLink({ url, region, auth: iamAuth }),
    createSubscriptionHandshakeLink({ url, region, auth: iamAuth }),
  ]);

  const desicionLink = new ApolloLink((operation, forward) => {
    return forward(operation);
  }).split(
    (operation) => operation.getContext()?.unAuthenticated === true,
    iamLink,
    cognitoLink
  );

  return new ApolloClient({
    cache,
    link: desicionLink,
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
};

export const useApolloClient = (appSyncConfig) => {
  const [client] = React.useState(() => createApolloClient(appSyncConfig));
  return client;
};
