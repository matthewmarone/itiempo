const { GetEmployee } = require("./api");
/**
 *
 */
class EmployeeLookup {
  constructor() {
    this.employeeMap = new Map();
  }
  /**
   *
   * @param {*} employeeId
   * @returns the employee record or null or undefined if lookup fails
   */
  async queryEmployee(employeeId) {
    console.log("Querying employee", employeeId);
    try {
      const { data, errors } = await GetEmployee(employeeId);
      if (errors || !data) {
        const errorMessage = `Query Failed: ${!errors[0] || errors[0].message}`;
        throw new Error(errorMessage);
      } else {
        return data.getEmployee;
      }
    } catch (e) {
      console.error("Couldn't lookup employee with id: " + employeeId, e);
    }
    return null;
  }
  /**
   * The difference between getEmployee and queryEmployee is getEmployee will first
   * try the cache, and if the query hasn't been made it will call queryEmployee and
   * then store the results in the cache (memory).
   * @param {*} employeeId
   * @returns the employee record or null or undefined if lookup fails
   */
  async getEmployee(employeeId) {
    const existing = this.employeeMap.get(employeeId);
    if (existing === undefined) {
      const e = await this.queryEmployee(employeeId);
      this.employeeMap.set(employeeId, e);
      return e;
    } else {
      return existing;
    }
  }

  /**
   * For testing
   */
  printMap() {
    console.log(JSON.stringify(this.employeeMap, null, 4));
  }
}

exports.EmployeeLookup = EmployeeLookup;
