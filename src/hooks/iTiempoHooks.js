import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useTimeRecordReport, useListEmployeesByEmail } from "hooks";
import { getDateContext, getWhenTimeOccursInAnotherTimeZone } from "helpers";
import { getPayRollReport } from "./util";
import { PayRollReport } from "./model";
import { Context } from "Store";
import { Logger } from "aws-amplify";

const logger = new Logger("iTiempoHooks.js", "ERROR");
const FIRST_TZ_OS = 14 * 60; // UTC+14 timezone offset in mins
const LAST_TZ_OS = -12 * 60; // UTC-12 ...

/**
 * Waits to return the employees until all the user has access to
 * has been downloaded
 * @returns an object with array of type Employee or null, and error which is set to null if there is non
 */
const useAllEmployees = () => {
  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const results = useListEmployeesByEmail(companyId, true);
  const { data, networkStatus } = results ?? {};
  const [retVal, setRetVal] = useState({
    employees: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    // Only set the employee list once it's completely downloaded
    if (
      // 7 is completed query
      networkStatus === 7 &&
      data?.listEmployeesByEmail != null &&
      data.listEmployeesByEmail.nextToken == null
    ) {
      setRetVal({
        employees: data.listEmployeesByEmail.items,
        error: null,
        loading: false,
      });
    } else if (networkStatus === 8) {
      setRetVal({
        employees: null,
        error: new Error("Network: could not contact server."),
        loading: false,
      });
    } else {
      // Any other state means it's querying again
      // We let the caller know it's loading, but
      // we don't update the employee list until
      // we finish loading again.
      setRetVal((v) => ({ ...v, loading: true }));
    }
  }, [data, networkStatus]);

  return retVal;
};

/**
 * Waits for all records to download before returning.  Expands the
 * iso local date filters to include all timezones around the world.
 * @returns
 */
const useAllPayRollReport = () => {
  const [getReport, results] = useTimeRecordReport();
  const [retVal, setRetVal] = useState({
    timeRecords: null,
    error: null,
    loading: false, // doesn't load until getReport is called
  });
  const { data, networkStatus } = results ?? {};

  useEffect(() => {
    // Only set the employee list once it's completely downloaded
    if (
      // 7 means successful query return
      networkStatus === 7 &&
      data?.timeRecordReport != null &&
      data.timeRecordReport.nextToken == null
    ) {
      setRetVal({
        timeRecords: data.timeRecordReport.items,
        error: null,
        loading: false,
      });
    } else if (networkStatus === 8) {
      setRetVal({
        timeRecords: null,
        error: new Error("Network: could not contact server."),
        loading: false,
      });
    } else {
      // Any other state means it's querying again
      // We let the caller know it's loading, but
      // we don't update the record list until
      // we finish loading again.
      setRetVal((v) => ({ ...v, loading: true }));
    }
  }, [data, networkStatus]);

  const executeQuery = useCallback(
    (fromISODate, toISODate) => {
      try {
        console.log({ fromISODate, toISODate });
        const { startOfMonth, startOfWeek } = getDateContext(fromISODate);
        const earliestLocal =
          startOfMonth < startOfWeek ? startOfMonth : startOfWeek;
        const earliest = getWhenTimeOccursInAnotherTimeZone(
          earliestLocal,
          FIRST_TZ_OS
        );
        const from = Math.round(earliest.getTime() / 1000);
        const { endOfDay } = getDateContext(toISODate);
        const latest = getWhenTimeOccursInAnotherTimeZone(endOfDay, LAST_TZ_OS);
        const to = Math.round(latest.getTime() / 1000) - 1; // minus 1 because it rounds up to midnight
        getReport({ from, to });
      } catch (e) {
        if (e.message === "Invalid Date") {
          // Wait for user to provide date filter
          setRetVal((v) => ({ ...v, timeRecords: null, error: null }));
        } else {
          setRetVal((v) => ({ ...v, timeRecords: null, error: e }));
          logger.error(e);
        }
      }
    },
    [getReport]
  );

  return [executeQuery, retVal];
};

/**
 *
 * @param {} param0 {fromDateStr: IOS local date, toDateStr: IOS local date, employeeIds?: [String], groupBy?:String }
 */
export const usePayrollReport = (report_options) => {
  // Get all the employees the user has access too
  // Waits for complete list
  const {
    employees,
    loading: loadingEmployees,
    error: errorEmployee,
  } = useAllEmployees();

  // Get all the time records, waits for complete list
  const [
    queryTimeRecords,
    { timeRecords, loading: loadingTimeRecords, error: errorTimeRecords },
  ] = useAllPayRollReport();

  // The current report filter state
  const [{ fromDateStr, toDateStr, employeeIds, groupBy }, setReportOptions] =
    useState({
      ...(report_options || {}),
    });

  // When report dates change request updates
  useEffect(() => {
    queryTimeRecords(fromDateStr, toDateStr);
  }, [fromDateStr, queryTimeRecords, toDateStr]);

  console.log({
    loadingEmployees,
    errorEmployee,
    employees,
    loadingTimeRecords,
    errorTimeRecords,
    timeRecords,
  });

  const payRollReport = useMemo(() => {
    if (employees != null && timeRecords != null) {
      return new PayRollReport(timeRecords, employees);
    } else {
      return null;
    }
  }, [employees, timeRecords]);

  const report = useMemo(() => {
    if (payRollReport != null) {
      const testReport = payRollReport.getFlattenedReport(
        fromDateStr,
        toDateStr,
        employeeIds
      );
      console.log({ testReport });
      return payRollReport.getReport(
        fromDateStr,
        toDateStr,
        employeeIds,
        groupBy
      );
    }
  }, [employeeIds, fromDateStr, groupBy, payRollReport, toDateStr]);

  return [report, setReportOptions];
};
