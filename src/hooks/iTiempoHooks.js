import { useState } from "react";
import { useTimeRecordReport } from "hooks";

/**
 *
 * @param {} param0
 */
export const usePayrollReport = (report_options) => {
  const [query, queryResults] = useTimeRecordReport();
  const [{ fromDate, toDate, employeeIds, groupBy }, setReportOptions] =
    useState({
      ...(report_options || {}),
    });

  return [queryResults, setReportOptions];
};
