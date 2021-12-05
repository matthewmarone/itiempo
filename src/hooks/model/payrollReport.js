import { parseDate, getTimeDifference, getDateContext } from "helpers";
import { Logger } from "aws-amplify";
const logger = new Logger("payrollReport.js", "ERROR");

/**
 *
 * @param {*} timeRecord
 * @param {*?} previousEntry
 * @returns
 */
const createEntry = (timeRecord, previousEntry) => {
  const { timestampIn, timestampOut } = timeRecord;
  const minutes = getTimeDifference(timestampIn, timestampOut);
  const {
    runningTotals: { dayMins, weekMins, monthMins } = {},
    timeRecord: { timestampIn: prevTimestampIn = -timestampIn } = {},
  } = previousEntry ?? {};
  const curDateCtx = getDateContext(timestampIn * 1000);
  const prevDateCtx = getDateContext(prevTimestampIn * 1000);

  const sameDay =
    curDateCtx.startOfDay.getTime() === prevDateCtx.startOfDay.getTime();
  const sameWeek =
    curDateCtx.startOfWeek.getTime() === prevDateCtx.startOfWeek.getTime();
  const sameMonth =
    curDateCtx.startOfMonth.getTime() === prevDateCtx.startOfMonth.getTime();

  const runningTotals = {
    date: curDateCtx.startOfDay,
    dayMins: sameDay ? dayMins + minutes : minutes,
    weekMins: sameWeek ? weekMins + minutes : minutes,
    monthMins: sameMonth ? monthMins + minutes : minutes,
  };

  return {
    runningTotals,
    timeRecord,
  };
};

/**
 *
 * @param {*} employeeRecord
 * @param {*} managerRecord
 * @param {*} prevTimeRecord
 * @param {*} rowEntry
 */
const createReportRow = (rowEntry, employeeRecord, managerRecord) => {
  const { runningTotals, timeRecord } = rowEntry;
  console.log({ rowEntry });
  const {
    id: employeeId,
    firstName,
    lastName,
    email,
    phone,
    department,
    jobTitle,
  } = employeeRecord;
  const {
    id: primaryManagerId,
    firstName: primaryManagerFirstName,
    lastName: primaryManagerLastName,
    email: primaryManagerEmail,
  } = managerRecord;
  const { id, timestampIn, timestampOut, approved, approvedBy, rate } =
    timeRecord;
  const { date, dayMins, weekMins, monthMins } = runningTotals;

  return [
    id,
    date,
    employeeId,
    firstName,
    lastName,
    email,
    phone,
    department,
    jobTitle,
    primaryManagerId,
    primaryManagerFirstName,
    primaryManagerLastName,
    primaryManagerEmail,
    timestampIn,
    timestampOut,
    approved,
    approvedBy,
    rate,
    dayMins,
    weekMins,
    monthMins,
  ];
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
  #employeeMap;
  #employeeTimeRecords;

  constructor(timeRecords, employeeRecords) {
    if (!Array.isArray(timeRecords) || !Array.isArray(employeeRecords)) {
      throw new Error("Expected Array for timeRecords and employeeRecords");
    }

    this.#employeeTimeRecords = new Map();

    this.#employeeMap = employeeRecords.reduce((employeeMap, employee) => {
      return employeeMap.set(employee.id, employee);
    }, new Map());

    // Add in all the time records
    for (let i = timeRecords.length - 1; i >= 0; i--) {
      this.addTimeRecord(timeRecords[i]);
    }
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
      const employee = this.#employeeMap.get(employeeId);
      const primaryManager = this.#employeeMap.get(employee?.primaryManagerId);

      if (employee == null || primaryManager == null) {
        logger.warn(
          "Could not lookup employee and/or the associated manager record.  This employee will not be include in the report."
        );
        return;
      }

      const timeRecords = this.#employeeTimeRecords.get(employeeId) ?? [];
      const prevRec =
        timeRecords.length > 0 ? timeRecords[timeRecords.length - 1] : null;
      if (prevRec != null && prevRec.timestampIn > timestampIn) {
        throw new Error(
          "Expected time records to be added in ascending order."
        );
      }

      timeRecords[timeRecords.length] = createEntry(timeRecord, prevRec);
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
   * @param {String?} groupBy
   * @returns
   */
  getReport(fromIsoDate, toIsoDate, employeeIdsToLimitTo, groupBy) {
    const from = parseDate(fromIsoDate);
    const to = parseDate(toIsoDate);
    const employeeIds =
      employeeIdsToLimitTo?.length > 0
        ? employeeIdsToLimitTo
        : [...this.#employeeTimeRecords.keys()];

    console.log({ from, to, employeeIds, groupBy });
    // TODO: return a copy
    return this.#employeeTimeRecords;
  }

  getFlattenedReport(fromIsoDate, toIsoDate, employeeIdsToLimitTo) {
    const records = this.getReport(
      fromIsoDate,
      toIsoDate,
      employeeIdsToLimitTo,
      null
    );

    const csvRows = [];

    records.forEach((entries, employeeId) => {
      const employee = this.#employeeMap.get(employeeId);
      const manager = this.#employeeMap.get(employee.primaryManagerId);
      entries.forEach((entry) => {
        csvRows[csvRows.length] = createReportRow(entry, employee, manager);
      });
    });

    return csvRows;
  }
}

export default PayRollReport;
