import { useState, useMemo, useEffect } from "react";
import { useTimeRecordReport } from "hooks";
import { parseDate } from "helpers";

/**
 *
 * @param {} param0 {fromDateStr: IOS local date, toDateStr: IOS local date, employeeIds?: [String], groupBy?:String }
 */
export const usePayrollReport = (report_options) => {
  const [query, queryResults] = useTimeRecordReport();
  const [{ fromDateStr, toDateStr, employeeIds, groupBy }, setReportOptions] =
    useState({
      ...(report_options || {}),
    });

  const [fromDate, toDate] = useMemo(() => {
    let from, to;
    try {
      from = parseDate(fromDateStr);
      to = parseDate(toDateStr);
    } catch (e) {
      console.error(e); // Invalid date
    }
    return [from, to];
  }, [fromDateStr, toDateStr]);

  useEffect(() => {
    if (fromDate < toDate) {
      query({ from: fromDate, to: toDate });
    }
  }, [fromDate, query, toDate]);

  console.log({ fromDate, toDate, employeeIds, groupBy });
  return [queryResults, setReportOptions];
};
