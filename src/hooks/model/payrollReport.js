import { Logger } from "aws-amplify";
import { getTimeDifference } from "helpers";
const logger = new Logger("payrollReport.js", "ERROR");

const DEFAULT_STATS = {
  minutes: 0,
  runningTotalMinutes: 0,
  // totalPay: 0,
};

const createNewEmployeesReportStats = () => ({
  records: [],
  ...DEFAULT_STATS,
});

/**
 *
 * @param {*} previousRecord
 * @param {*} record
 * @returns
 */
const createAnalysedRecord = (previousRecord, record) => {
  const { timestampIn, timestampOut } = record;
  const previousStats = previousRecord?.stats ?? { ...DEFAULT_STATS };
  const stats = { ...DEFAULT_STATS };
  stats.minutes = getTimeDifference(timestampIn, timestampOut);
  stats.runningTotalMinutes = stats.minutes + previousStats.runningTotalMinutes;

  return { stats, record };
};

/**
 *
 * @param {*} timeRecord
 * @param {*} employeeReport
 */
const updateEmployeesReport = (timeRecord, employeeReport) => {
  const { timestampIn } = timeRecord;
  const { records: reportRecords } = employeeReport;
  const previousRecord =
    reportRecords.length > 0 ? reportRecords[reportRecords.length - 1] : null;

  if (
    previousRecord != null &&
    previousRecord.record.timestampIn > timestampIn
  ) {
    throw new Error("Expected time records to be added in ascending order.");
  }

  reportRecords[reportRecords.length] = createAnalysedRecord(
    previousRecord,
    timeRecord
  );
};

/**
 * Employees with their records, totals and stats, and the
 *  the individual time records have overtime meta data.
 *
 * Then, we have our categories, which have Employees.
 *
 * We will have methods to get a view based on category or employees, date filter
 *
 */
class PayRollReport {
  #getEmployeeRecord;
  #employeeReports;
  #categoryReports;

  constructor(employeeLookupFunction) {
    this.#getEmployeeRecord = employeeLookupFunction;
    this.#employeeReports = new Map();
    this.#categoryReports = new Map();
  }

  /**
   * Get's current report or initializes a new one for the
   * employeeId.
   * @param {String} employeeId
   * @returns the associated time record report for the employeeId
   */
  getEmployeesReport(employeeId) {
    if (this.#employeeReports.has(employeeId)) {
      return this.#employeeReports.get(employeeId);
    } else {
      const retVal = createNewEmployeesReportStats();
      this.#employeeReports.set(employeeId, retVal);
      return retVal;
    }
  }

  addTimeRecord(timeRecord) {
    if (timeRecord != null) {
      const { employeeId, timestampIn, timestampOut } = timeRecord;
      // Get's the associated employee record
      const employee = this.#getEmployeeRecord(employeeId);
      if (employee == null) {
        logger.warn(
          "Could not lookup employee record.  This employee will not be include in the report."
        );
        return;
      } else {
        const { department, primaryManagerId, payRates } = employee;
        const employeeReport = this.getEmployeesReport(employeeId);
        updateEmployeesReport(timeRecord, employeeReport);
      }
    } else {
      throw new Error(`Expected type TimeRecord, but got ${timeRecord}`);
    }
  }

  toString() {
    let retVal = ``;
    this.#employeeReports.forEach((value, key) => {
      retVal = `${retVal}
      __________________
      ${key}: ${value}
      `;
    });
  }
}

export default PayRollReport;
