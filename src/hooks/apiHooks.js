import { useState, useEffect, useMemo, useCallback } from "react";
import {
  listEmployeeTimeRecords as listEmployeeTimeRecordsGQL,
  listEmployeesByEmail as listEmployeesByEmailGQL,
  getEmployee as getEmployeeGQL,
  timeRecordReport as timeRecordReportGQL,
  quickClockIn as quickClockInGQL,
  employeePayRates as employeePayRatesGQL,
} from "graphql/queries";
import {
  setupNewAccount as setupNewAccountGQL,
  createTimeRec as createTimeRecordGQL,
  updateTimeRec as updateTimeRecordGQL,
  createUser as createUserGQL,
  updateEmpl as updateEmployeeGQL,
  clockIn as clockInGQL,
  clockOut as clockOutGQL,
  createQP as createQpGQL,
  resetPassword as resetPasswordGQL,
  punchInByPin as punchInByPinGQL,
  deleteTimeRec as deleteTimeRecGQL,
} from "graphql/mutations";
import { Logger } from "aws-amplify";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Storage } from "aws-amplify";
import { mergeSortedLists, daysIntoYear } from "helpers";
// eslint-disable-next-line
const logger = new Logger("hooks.js", "ERROR");

export const CONSTS = {
  LIMIT_DEFAULT: 10,
  LIMIT_25: 25,
  LIMIT_50: 50,
  ASC: "ASC",
  DESC: "DESC",
};

/**
 *
 * @param {*} settings
 * @returns [verseObj, setArgs]
 */
export const useVerse = (settings) => {
  const [verseObj, setVerseObj] = useState();
  const [args, setArgs] = useState({
    lang: "en",
    yearDay: daysIntoYear(),
    ...(settings || {}),
  });

  useEffect(() => {
    const { lang = "en", yearDay } = args;
    import(`assets/verses/${lang}`)
      .then((d) => {
        const { default: allVerses } = d || {};
        if (!Array.isArray(allVerses) || allVerses.length === 0)
          throw new Error(`No verses availble for lang '${lang}'`);
        // Get the verse for the day, or the last one on the list in none available
        setVerseObj(allVerses[yearDay - 1] || allVerses[allVerses.length - 1]);
      })
      .catch((e) => {
        console.error(e);
        setVerseObj(null);
      });
  }, [args]);

  return [verseObj, setArgs];
};

/**
 *
 * @param {*} param0
 */
export const useDownloadImage = ({
  key,
  level = "public",
  download = false,
} = {}) => {
  const [variables, setVars] = useState({
    key,
    level,
    download,
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { key, level, download } = variables;
    console.log("key key", key);
    if (key) {
      setError(null);
      setLoading(true);
      Storage.get(key, { level, download })
        .then((res) => {
          setLoading(false);
          setData(res);
        })
        .catch((e) => {
          setLoading(false);
          setError(e);
          setData(null);
          logger.error(e);
        });
    }
  }, [variables]);

  const setVariables = useCallback((updatedVariables) => {
    setVars((prevVariables) => {
      return { ...prevVariables, ...updatedVariables };
    });
  }, []);

  return [setVariables, { loading, error, data }];
};

/**
 *
 */
export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  /**
   *
   */
  const upload = useCallback((fileName, imgBlob) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    Storage.put(fileName, imgBlob, {
      level: "public",
      contentType: imgBlob.type,
      // progressCallback: (v) => logger.debug("Upload Progress", v),
    })
      .then((v) => {
        setLoading(false);
        setResponse(v);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
        logger.error(e);
      });
  }, []);
  return [upload, { loading, error, response }];
};
/**
 *
 */
export const useUpdateEmployee = () => useMutation(gql(updateEmployeeGQL));

/**
 *
 */
export const useSetupNewAccount = () => useMutation(gql(setupNewAccountGQL));

/**
 *
 */
export const useCreateQuickPunch = () => useMutation(gql(createQpGQL));

/**
 *
 */
export const useResetPassword = () => useMutation(gql(resetPasswordGQL));
/**
 *
 */
export const usePunchInByPin = () =>
  useMutation(gql(punchInByPinGQL), {
    context: { unAuthenticated: true },
    fetchPolicy: "no-cache",
  });

/**
 *
 * @param {*} input
 */
export const useCreateEmployee = () =>
  useMutation(gql(createUserGQL), {
    update(cache, { data: { createUser: newRecord } }) {
      if (newRecord) {
        // Variables needed for modifying cache
        const { companyId } = newRecord;
        const query = gql(listEmployeesByEmailGQL);
        const variables = {
          companyId,
          limit: CONSTS.LIMIT_DEFAULT,
          sortDirection: CONSTS.ASC,
        };
        // Get the current list from the cache
        const {
          listEmployeesByEmail: { items: prevRecords },
        } = cache.readQuery({ query, variables }) || {
          listEmployeesByEmail: {},
        };
        // Create a new list from the existing cached data,
        // but adding in the new record where is should be
        const mergedItems = mergeSortedLists(
          [newRecord],
          prevRecords || [],
          ({ email: t1 }, { email: t2 }) => (t1 === t2 ? 0 : t1 < t2 ? -1 : 1)
        );
        // Write the updated list w the new record to the cache
        cache.writeQuery({
          query,
          variables,
          data: {
            listEmployeesByEmail: {
              items: mergedItems,
            },
          },
        });
      }
    },
  });

/**
 *
 */
export const useCreateTimeRecord = () =>
  useMutation(gql(createTimeRecordGQL), {
    update: (cache, { data: { createTimeRec } }) =>
      updateListEmployeeTimeRecords(cache, createTimeRec),
  });

/**
 *
 */
export const useUpdateTimeRecord = () =>
  useMutation(gql(updateTimeRecordGQL), {
    update: (cache, { data }) =>
      updateListEmployeeTimeRecords(cache, data?.updateTimeRec, true),
  });

/**
 *
 */
export const useDeleteTimeRecord = () => useMutation(gql(deleteTimeRecGQL));

/**
 *
 * @param {*} cache
 * @param {*} theRecord
 * @param {*} isUpdate setting to true will cause the previous record to be removed from list
 */
const updateListEmployeeTimeRecords = (cache, theRecord, isUpdate) => {
  if (theRecord) {
    // // Variables needed for modifying cache
    const { id: timeRecordId, employeeId } = theRecord;
    const query = gql(listEmployeeTimeRecordsGQL);
    const variables = {
      limit: CONSTS.LIMIT_DEFAULT,
      sortDirection: CONSTS.DESC,
      employeeId,
    };
    // // Get the current list from the cache
    // const { listEmployeeTimeRecords } = cache.readQuery({
    //   query,
    //   variables,
    // }) || {
    //   listEmployeeTimeRecords: {},
    // };
    // // Create a new list from the existing cached data,
    // // but adding in the new record where is should be
    // // timerecords are allways querried and stored in desc order of timestampIn
    // const mergedItems = mergeSortedLists(
    //   [newRecord],
    //   prevRecords || [],
    //   ({ timestampIn: t1 }, { timestampIn: t2 }) =>
    //     t1 === t2 ? 0 : t1 < t2 ? -1 : 1,
    //   false
    // );
    // Write the updated list w the new record to the cache

    if (isUpdate) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          [`listEmployeeTimeRecords:{"employeeId":"${employeeId}"}`]: (
            existing,
            { readField }
          ) => {
            console.log("testing cache.modify", existing);
            return Array.isArray(existing?.items)
              ? {
                  ...existing,
                  items: existing.items.filter(
                    (itemRef) => timeRecordId !== readField("id", itemRef)
                  ),
                }
              : existing;
          },
        },
      });
    }

    cache.writeQuery({
      query,
      variables,
      data: {
        listEmployeeTimeRecords: {
          // items: mergedItems,
          items: [theRecord],
        },
      },
    });
  }
};
/**
 *
 */
export const useClockIn = () =>
  useMutation(gql(clockInGQL), {
    update: (cache, { data: { clockIn } }) =>
      updateListEmployeeTimeRecords(cache, clockIn),
  });
/**
 *
 */
export const useClockOut = () => useMutation(gql(clockOutGQL));

export const CLOCK_IN_STATE = {
  IN: "in",
  OUT: "out",
  CLOCKING_IN: "clocking_in",
  CLOCKING_OUT: "clocking_out",
  UNKNOWN: "unknown",
};

/**
 *
 * @param {*} employeeId
 */
export const useClockedIn = (_employeeId) => {
  const [employeeId, setEmployeeId] = useState(_employeeId);
  const [runQuery, { loading, error, data }] = useListEmployeeTimeRecord({
    employeeId,
  });

  useEffect(() => {
    if (employeeId) {
      runQuery({ employeeId });
    }
  }, [employeeId, runQuery]);

  const [clockInState, latestRecord] = useMemo(() => {
    if (data && data.listEmployeeTimeRecords) {
      const [lastTS] = data.listEmployeeTimeRecords.items || [];
      if (!lastTS) {
        // If there is no timesheet rec, then it is their 1st clock-in ever
        return [CLOCK_IN_STATE.OUT, null];
      } else {
        return [
          !lastTS.timestampOut ? CLOCK_IN_STATE.IN : CLOCK_IN_STATE.OUT,
          lastTS,
        ];
      }
    } else {
      return [CLOCK_IN_STATE.UNKNOWN, null];
    }
  }, [data]);

  console.log("Data", data);

  logger.debug(
    "useClockedIn => ",
    loading,
    error,
    data,
    clockInState,
    latestRecord
  );

  return [clockInState, setEmployeeId, latestRecord];
};

/**
 *
 * @param {*} queryVariables
 */
export const useListEmployeeTimeRecord = (queryVariables) => {
  const getVariables = useCallback((vars) => {
    const {
      employeeId,
      fromDate: ge,
      toDate: le,
      limit = CONSTS.LIMIT_DEFAULT,
    } = vars;
    const timestampIn =
      le && ge ? { between: [ge, le] } : le ? { le } : undefined;
    return { limit, sortDirection: CONSTS.DESC, employeeId, timestampIn };
  }, []);
  const [variables, setVariables] = useState(queryVariables);
  const { fetchMore, ...queryResults } = useQuery(
    gql(listEmployeeTimeRecordsGQL),
    {
      variables: getVariables(variables),
    }
  );

  useEffect(() => {
    if (variables) {
      const v = getVariables(variables);
      fetchMore({
        variables: v,
      });
      // for testing
      logger.debug("RunQuery", { variables: v });
    }
  }, [getVariables, fetchMore, variables]);

  return [setVariables, queryResults];
};

/**
 *
 * @param {*} employeeId
 */
export const useGetEmployee = (employeeId) => {
  const [id, setId] = useState(employeeId);
  const [runQuery, queryResults] = useLazyQuery(gql(getEmployeeGQL));

  useEffect(() => {
    if (id) {
      console.log("running query with ID", id);
      runQuery({ variables: { id } });
    }
  }, [id, runQuery]);

  return [setId, queryResults];
};
/**
 *
 * @param {*} companyId
 * @returns
 */
export const useListEmployeesByEmail = (companyId) => {
  const retVal = useQuery(gql(listEmployeesByEmailGQL), {
    variables: {
      companyId,
      limit: CONSTS.LIMIT_DEFAULT,
      sortDirection: CONSTS.ASC,
    },
  });

  const { data, fetchMore, variables } = retVal;

  useEffect(() => {
    if (data?.listEmployeesByEmail?.nextToken)
      fetchMore({
        variables: {
          ...variables,
          limit: CONSTS.LIMIT_50,
          nextToken: data.listEmployeesByEmail.nextToken,
        },
      });
  }, [data?.listEmployeesByEmail?.nextToken, fetchMore, variables]);

  return retVal;
};
/**
 *
 */
export const useQuickClockIn = () => {
  const [query, retVal] = useLazyQuery(gql(quickClockInGQL), {
    context: { unAuthenticated: true },
    fetchPolicy: "no-cache",
  });
  const setVariables = useCallback(
    (v) => {
      query({
        variables: {
          limit: CONSTS.LIMIT_25,
          ...v,
        },
      });
    },
    [query]
  );
  return [setVariables, retVal];
};

/**
 *
 * @param {*} employeeId
 * @returns
 */
export const useEmployeePayRates = (_employeeId) => {
  const [employeeId, setEmployeeId] = useState(_employeeId);
  const [query, retVal] = useLazyQuery(gql(employeePayRatesGQL), {
    context: { unAuthenticated: true },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (employeeId)
      query({
        variables: { employeeId },
      });
  }, [employeeId, query]);

  return [setEmployeeId, retVal];
};

/**
 *
 */
export const useTimeRecordReport = () => {
  const [runQuery, retVal] = useLazyQuery(gql(timeRecordReportGQL), {
    notifyOnNetworkStatusChange: true,
  });
  const { data, fetchMore, refetch, variables, called } = retVal || {};
  const [nextToken, setNextToken] = useState(null);

  /**
   * For pagnation, if there is a nextToken
   */
  useEffect(() => {
    if (nextToken && fetchMore && variables) {
      fetchMore({
        variables: { ...variables, limit: CONSTS.LIMIT_50, nextToken },
      });
      setNextToken(null);
    }
  }, [fetchMore, nextToken, variables]);

  /**
   * Detects the need to pagnate
   */
  useEffect(() => {
    setNextToken(data?.timeRecordReport?.nextToken);
  }, [data?.timeRecordReport?.nextToken]);

  /**
   *
   */
  const query = useCallback(
    (filter) => {
      const { from, to } = filter || {};

      if (from < to) {
        if (!called) {
          runQuery({
            variables: { filter: { from, to }, limit: CONSTS.LIMIT_25 },
          });
        } else {
          refetch({ filter: { from, to }, limit: CONSTS.LIMIT_25 });
        }
      }
    },
    [called, refetch, runQuery]
  );

  return [query, retVal];
};
