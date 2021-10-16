import { parseDate } from "helpers";
import { Logger } from "aws-amplify";
const logger = new Logger("payrollReport.js", "ERROR");

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
  #employeeTimeRecords;

  constructor(employeeLookupFunction) {
    this.#getEmployeeRecord = employeeLookupFunction;
    this.#employeeTimeRecords = new Map();
  }

  /**
   *
   * @param {Object<TimeRecord>} timeRecord
   * @returns
   */
  addTimeRecord(timeRecord) {
    if (timeRecord != null) {
      const { employeeId, timestampIn } = timeRecord;
      // Get's the associated employee record
      const employee = this.#getEmployeeRecord(employeeId);
      const primaryManager = this.#getEmployeeRecord(
        employee?.primaryManagerId
      );

      if (employee == null || primaryManager == null) {
        logger.warn(
          "Could not lookup employee and/or the associated manager record.  This employee will not be include in the report."
        );
        return;
      }

      const timeRecords = this.#employeeTimeRecords.get(employeeId) ?? [];

      if (
        timeRecords.length > 0 &&
        timeRecords[timeRecords.length - 1].timestampIn > timestampIn
      ) {
        throw new Error(
          "Expected time records to be added in ascending order."
        );
      }

      timeRecords[timeRecords.length] = timeRecord;
      this.#employeeTimeRecords.set(employeeId, timeRecords);
    } else {
      throw new Error(`Expected type TimeRecord, but got ${timeRecord}`);
    }
  }

  /**
   *
   * @param {String} fromIsoDate
   * @param {String} toIsoDate
   * @param {Array<String>} employeeIdsToLimitTo
   * @param {String} groupBy
   * @returns
   */
  getReport(fromIsoDate, toIsoDate, employeeIdsToLimitTo, groupBy) {
    const from = parseDate(fromIsoDate);
    const to = parseDate(toIsoDate);
    const employeeIds =
      employeeIdsToLimitTo?.length > 0
        ? employeeIdsToLimitTo
        : [...this.#employeeTimeRecords.keys()];

    console.log({ from, to, employeeIds, pr: this });

    // TODO: Left of here...
    /**
     * We essentially have a PayRollReport instance hydrated
     * with time records in ascending order and mapped by employeeId.
     * Now, we need to loop through them
     * calculating/storing totals for each employee, like weekly over time
     * and filtering
     * the returned records to include those within the date boundaries
     * as well as rolling up the records under a groupBy category, if
     * applicable.
     *
     * Recommendation, start by defining the output we want.
     */

    return {};
  }
}

export default PayRollReport;
