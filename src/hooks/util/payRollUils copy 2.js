import { PayRollReport } from "hooks/model";

/**
 *
 * @param {Array<Object>} timeRecords expects the time records in descending order
 * @param {Array<Object>} employeeRecords
 * @param {String} fromIsoDate
 * @param {String} toIsoDate
 * @param {Array<String>?} employeeIdsToLimitTo
 * @param {String?} groupBy
 * @returns
 */
export const getPayRollReport = (
  timeRecords,
  employeeRecords,
  fromIsoDate,
  toIsoDate,
  employeeIdsToLimitTo,
  groupBy
) => {
  // This function is passed to PayRollReport so that it can lookup
  // an Employee record
  const employeeMap = employeeRecords.reduce((employeeMap, employee) => {
    return employeeMap.set(employee.id, employee);
  }, new Map());

  // Create a new PayRollReport object
  const report = new PayRollReport((eId) => employeeMap.get(eId));

  // Add in all the time records
  for (let i = timeRecords.length - 1; i >= 0; i--) {
    report.addTimeRecord(timeRecords[i]);
  }

  // Returned the report filtered and grouped as requested by the client
  return report.getReport(
    fromIsoDate,
    toIsoDate,
    employeeIdsToLimitTo,
    groupBy
  );
};
