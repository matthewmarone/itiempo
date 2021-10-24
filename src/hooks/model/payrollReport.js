import { parseDate, getMonth, getWeek, getTimeDifference } from "helpers";
import { Logger } from "aws-amplify";
const logger = new Logger("payrollReport.js", "ERROR");

/**
 *
 * @param {String} groupBy
 * @param {Object} employee
 * @param {Object} timeRecord
 * @returns
 */
const getCategory = (groupBy, employee, timeRecord) => "default";

/**
 *
 * @param {Object} previousRecord
 * @param {Object} timeRecord
 * @returns
 */
const analysisTimeRecord = (previousRecord, timeRecord) => {
  const { timestampIn, timestampOut } = timeRecord;
  const week = getWeek(timestampIn * 1000);
  const month = getMonth(timestampIn * 1000);
  const minutes = getTimeDifference(timestampIn, timestampOut);

  const isSameWeek = previousRecord?.stats?.week === week;
  const isSameMonth = previousRecord?.stats?.month === month;

  const weekTotal = isSameWeek ? previousRecord.stats.week + minutes : minutes;
  const monthTotal = isSameMonth
    ? previousRecord.stats.month + minutes
    : minutes;

  const totalMinutes = (previousRecord?.stats?.totalMinutes ?? 0) + minutes;

  return {
    week,
    month,
    minutes,
    weekTotal,
    monthTotal,
    totalMinutes,
    record: timeRecord,
  };
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
    this.#employeeMap = employeeRecords.reduce((employeeMap, employee) => {
      return employeeMap.set(employee.id, employee);
    }, new Map());

    // Add in all the time records
    for (let i = timeRecords.length - 1; i >= 0; i--) {
      this.addTimeRecord(timeRecords[i]);
    }

    // TODO: Left off here, see excel spreadsheet for notes.
    // Recommending removing getReport from payRollUtils in favor
    // of direct instantiation of this class.
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

      const wrappedTimeRecord = analysisTimeRecord(prevRec, timeRecord);
      timeRecords[timeRecords.length] = wrappedTimeRecord;
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

    // console.log({ from, to, employeeIds, pr: this });

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

    const reportStats = {
      totalMinutes: 0,
    };
    const categories = new Map();
    const createNewCategory = (name) => ({
      stats: {
        month: new Map(),
        week: new Map(),
      },
      name,
      employeeTimeRecords: new Map(),
    });
    categories.set("default", createNewCategory("default"));

    employeeIds.forEach((employeeId) => {
      const employee = this.#employeeMap.get(employeeId);
      const wrappedTimeRecords = this.#employeeTimeRecords.get(employeeId);
      wrappedTimeRecords.forEach((tr) => {
        const { week, month, minutes, weekTotal, monthTotal, record } = tr;
        // Add to report Total stats
        reportStats.totalMinutes += minutes;
        // Add to category stats
        const categoryName = getCategory(groupBy, employee, tr);
        const {
          stats: { month: catMonths, week: catWeeks },
          employeeTimeRecords: catEmpTimeRecs,
        } =
          categories.get(categoryName) ??
          categories
            .set(categoryName, createNewCategory(categoryName))
            .get(categoryName);

        const monthStat =
          catMonths.get(month) ??
          catMonths
            .set(month, {
              totalMinutes: 0,
            })
            .get(month);
        monthStat.totalMinutes += minutes;

        const weekStat =
          catWeeks.get(week) ??
          catWeeks
            .set(week, {
              totalMinutes: 0,
            })
            .get(week);
        weekStat.totalMinutes += minutes;

        const employeesRecords =
          catEmpTimeRecs.get(employeeId) ??
          catEmpTimeRecs.set(employeeId, []).get(employeeId);

        employeesRecords[employeesRecords.length] = tr;
      });
    });

    // return {
    //   stats: {},
    //   categories: [
    //     {
    //       stats: {},
    //       name: "default",
    //       employeeTimeRecords: [
    //         {
    //           stats: {},
    //           employee: {},
    //           timeRecords: [
    //             {
    //               stats: {},
    //               timeRecord: {},
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // };

    return {
      stats: reportStats,
      categories: [...categories.values()],
    };
  }
}

export default PayRollReport;
