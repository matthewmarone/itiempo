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
  const employeeMap = employeeRecords.reduce((employeeMap, employee) => {
    return employeeMap.set(employee.id, employee);
  }, new Map());

  const report = new PayRollReport((eId) => employeeMap.get(eId));

  for (let i = timeRecords.length - 1; i >= 0; i--) {
    report.addTimeRecord(timeRecords[i]);
  }

  return report;
};
