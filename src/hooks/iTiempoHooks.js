import { useState, useEffect, useContext, useCallback } from "react";
import { useTimeRecordReport, useListEmployeesByEmail } from "hooks";
import { getDateContext, getWhenTimeOccursInAnotherTimeZone } from "helpers";
import { getGroupMap } from "./util";
import { Context } from "Store";
import { Logger } from "aws-amplify";

const logger = new Logger("iTiempoHooks.js", "ERROR");
const FIRST_TZ_OS = 14 * 60; // UTC+14 timezone offset in mins
const LAST_TZ_OS = -12 * 60; // UTC-12 ...

/**
 * Waits to return the employees until all the user has access to
 * has been downloaded
 * @returns an array of type Employee or null
 */
const useAllEmployees = () => {
  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const results = useListEmployeesByEmail(companyId, true);
  const { data, networkStatus } = results ?? {};
  const [retVal, setRetVal] = useState({ employees: null, error: null });

  useEffect(() => {
    // Only set the employee list once it's completely downloaded
    if (
      networkStatus === 7 &&
      data?.listEmployeesByEmail != null &&
      data.listEmployeesByEmail.nextToken == null
    ) {
      setRetVal({ employees: data.listEmployeesByEmail.items, error: null });
    } else if (networkStatus === 8) {
      setRetVal({
        employees: null,
        error: new Error("Network: could not contact server."),
      });
    }
  }, [data, networkStatus]);

  return retVal;
};

const useAllPayRollReport = () => {
  const [getReport, results] = useTimeRecordReport();
  const [retVal, setRetVal] = useState({ timeRecords: null, error: null });
  const { data, networkStatus } = results ?? {};

  useEffect(() => {
    // Only set the employee list once it's completely downloaded
    if (
      networkStatus === 7 &&
      data?.timeRecordReport != null &&
      data.timeRecordReport.nextToken == null
    ) {
      setRetVal({ timeRecords: data.timeRecordReport.items, error: null });
    } else if (networkStatus === 8) {
      setRetVal({
        timeRecords: null,
        error: new Error("Network: could not contact server."),
      });
    }
  }, [data, networkStatus]);

  const executeQuery = useCallback((fromISODate, toISODate) => {
    try {
      console.log({ fromISODate, toISODate });
      const { startOfMonth, startOfWeek } = getDateContext(fromISODate);
      const earliestLocal = startOfMonth < startOfWeek ? startOfMonth : startOfWeek;
      const earliest = getWhenTimeOccursInAnotherTimeZone(earliestLocal, FIRST_TZ_OS)
      const from = Math.round(earliest.getTime() / 1000);
      const { endOfDay } = getDateContext(toISODate);
      const latest = getWhenTimeOccursInAnotherTimeZone(endOfDay, LAST_TZ_OS)
      const to = Math.round(latest.getTime() / 1000) - 1; // minus 1 because it rounds up to midnight
      getReport({ from, to });
    } catch (e) {
      if (e.message === "Invalid Date") {
        // Wait for user to provide date filter
        setRetVal({ timeRecords: null, error: null });
      } else {
        setRetVal({ timeRecords: null, error: e });
        logger.error(e);
      }
    }
  }, []);

  return [executeQuery, retVal];
};

/**
 *
 * @param {} param0 {fromDateStr: IOS local date, toDateStr: IOS local date, employeeIds?: [String], groupBy?:String }
 */
export const usePayrollReport = (report_options) => {
  const { employees } = useAllEmployees();
  const [queryTimeRecords, timeRecords] = useAllPayRollReport();
  const [{ fromDateStr, toDateStr, employeeIds, groupBy }, setReportOptions] =
    useState({
      ...(report_options || {}),
    });

  useEffect(() => {
    queryTimeRecords(fromDateStr, toDateStr);
  }, [fromDateStr, queryTimeRecords, toDateStr]);

  // console.log({ employees, fromDateStr, toDateStr, employeeIds, groupBy });

  const queryResults = undefined;
  return [queryResults, setReportOptions];
};
