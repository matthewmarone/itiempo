import { useState, useMemo, useEffect, useContext } from "react";
import { useTimeRecordReport, useListEmployeesByEmail } from "hooks";
import { parseDate } from "helpers";
import { getGroupMap } from "./util";
import { Context } from "Store";

/**
 *
 * @param {} param0 {fromDateStr: IOS local date, toDateStr: IOS local date, employeeIds?: [String], groupBy?:String }
 */
export const usePayrollReport = (report_options) => {
  const [{ fromDateStr, toDateStr, employeeIds, groupBy }, setReportOptions] =
    useState({
      ...(report_options || {}),
    });
  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const employeeQuery = useListEmployeesByEmail(companyId)

  // const [query, queryResults] = useTimeRecordReport();

  // const groupMap = useMemo(() => {}, [queryResults]);

  // const [from, to] = useMemo(() => {
  //   let from, to;
  //   try {
  //     from = parseDate(fromDateStr).getTime() / 1000;
  //     to = parseDate(toDateStr).getTime() / 1000;
  //   } catch (e) {
  //     console.error(e); // Invalid date
  //   }
  //   return [from, to];
  // }, [fromDateStr, toDateStr]);

  // useEffect(() => {
  //   query({ from, to });
  // }, [from, query, to]);

  // const report = useMemo(() => {
  //   const { data } = queryResults() ?? {};
  //   if (data?.timeRecordReport?.items.length > 0) {
  //     // TODO: filter report and apply groupings
  //   } else {
  //     return [];
  //   }
  // }, []);

  // console.log({ from, to, employeeIds, groupBy });
  const queryResults = undefined;
  return [queryResults, setReportOptions];
};
