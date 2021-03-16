const OWNER_ROLE = "Owner";
const ADMIN_ROLE = "Admin";
const MANAGER_ROLE = "Manager";
const DEFAULT_EMPLOYEE_ROLE = "Employee";
const ACCOUNTANT_ROLE = "Accountant";

const ROLE_Weight = {
  [OWNER_ROLE]: 4,
  [ADMIN_ROLE]: 3,
  [MANAGER_ROLE]: 2,
  [ACCOUNTANT_ROLE]: 1,
  [DEFAULT_EMPLOYEE_ROLE]: 1,
};
/**
 * pass in a role Owner, Admin, Accountant...etc.
 * @param {*} greater
 * @param {*} lessor
 */
const isRoleGreater = (greater, lessor) =>
  ROLE_Weight[greater] > ROLE_Weight[lessor];

/**
 * Extract the highest assigned role of the requester (logged in usr)
 * @param {*} cognitoGroup
 */
const getHighestGroup = (cognitoGroup = [], cId) => {
  // Extract the highest assigned role of the requester (logged in usr)
  let requestorsHighestRole = DEFAULT_EMPLOYEE_ROLE;
  cognitoGroup.forEach((r) => {
    // Ex: r = 'Owner-a03dc17c-a10c-437d-84de-35b5f0a675e5'
    const [rName] = r.split("-");
    const [, compId] = r.split(`${rName}-`);
    if (compId === cId) {
      // Choose the highest weight role
      if (ROLE_Weight[rName] > ROLE_Weight[requestorsHighestRole]) {
        requestorsHighestRole = rName;
      }
    }
  });
  return requestorsHighestRole;
};

/**
 * // Extract the highest role of the employee record being updated
 * @param {*} roleArray
 */
const getHighestRole = (roleArray = []) => {
  // Extract the highest role of the employee record being updated
  let employeesHighestRole = DEFAULT_EMPLOYEE_ROLE;
  roleArray.forEach((r) => {
    // Choose the highest weight role
    if (ROLE_Weight[r] > ROLE_Weight[employeesHighestRole]) {
      employeesHighestRole = r;
    }
  });
  return employeesHighestRole;
};

/**
 * Note: this function assumes that the requestorClaims
 * and employee data is not falsified.
 *
 * @param {*} requestorClaims { eId, cId, "cognito:groups"}
 * @param {*} employee { roles, primaryManagerId, companyId, managerIds = [] }
 * @returns an object {requestorsHighestRole, employeesHighestRole, authorized}
 *  where the roles are the highest weighted and authorized is false if the user
 *  (requestorClaims) belongs to a
 *  different company, has role employee and is not itself, or role manager and
 *  isn't the primary manager, or one of the employees other managers;
 *  otherwise true
 */
const isAuthorizedToUpdateEmployee = (requestorClaims, employee) => {
  const { eId, cId, "cognito:groups": requestorsRoleArr } = requestorClaims;
  const { id, roles, primaryManagerId, companyId, managerIds = [] } = employee;
  if (!(roles && primaryManagerId && companyId))
    return { authorized: false, reason: "Required fields are not present" };

  // Extract the highest assigned role of the requester (logged in usr)
  const requestorsHighestRole = getHighestGroup(requestorsRoleArr, cId);

  // Extract the highest role of the employee record being updated
  const employeesHighestRole = getHighestRole(roles);

  const retVal = { requestorsHighestRole, employeesHighestRole };

  // Making sure the requetor is not hacking into another company
  if (cId === companyId) {
    if (
      // Employees can make some updates to themselves, and
      eId === id ||
      // Admins and owners can always update
      isRoleGreater(requestorsHighestRole, MANAGER_ROLE) ||
      // Or they are a manager that manages this employee
      (requestorsHighestRole === MANAGER_ROLE &&
        [primaryManagerId, ...(managerIds || [])].includes(eId))
    ) {
      return { ...retVal, authorized: true };
    } else {
      return {
        ...retVal,
        authorized: false,
        reason:
          "User a is unauthorized to update employee b: " +
          JSON.stringify({ a: requestorClaims, b: employee }, null, 4),
      };
    }
  } else {
    return {
      ...retVal,
      authorized: false,
      reason: "User belongs to another company",
    };
  }
};

/**
 * Note: this function assumes that the requestorClaims
 * and employee data is not falsified.
 * Also, it would allow role changes to oneself
 * @param {*} requestorClaims { eId, cId, "cognito:groups"}
 * @param {*} employee { roles, primaryManagerId, companyId, managerIds = [] }
 * @param {*} newRole - enum ["Owner", "Admin", "Manager", "Employee",]
 */
const isAuthorizedToUpdateRole = (requestorClaims, employee, newRole) => {
  // Check that the roles is legit
  if (!ROLE_Weight[newRole]) return false;
  const { eId } = requestorClaims;
  const { id = eId } = employee;
  const {
    requestorsHighestRole,
    employeesHighestRole,
    authorized,
  } = isAuthorizedToUpdateEmployee(requestorClaims, employee);

  if (!authorized) return false;

  // Don't let a user change their own role
  if (eId === id) return false;

  // Users with Role Employee are never authorized to update role
  if (requestorsHighestRole === DEFAULT_EMPLOYEE_ROLE) return false;

  // Making sure the role of the requester is not beneath the targeted employee
  if (ROLE_Weight[requestorsHighestRole] < ROLE_Weight[employeesHighestRole])
    return false;

  // Making sure the requeater is not attempting to assign a role higher than their own
  if (ROLE_Weight[newRole] > ROLE_Weight[requestorsHighestRole]) return false;

  return true;
};

exports.OWNER_ROLE = OWNER_ROLE;
exports.ADMIN_ROLE = ADMIN_ROLE;
exports.MANAGER_ROLE = MANAGER_ROLE;
exports.ACCOUNTANT_ROLE = ACCOUNTANT_ROLE;
exports.DEFAULT_EMPLOYEE_ROLE = DEFAULT_EMPLOYEE_ROLE;
exports.isAuthorizedToUpdateRole = isAuthorizedToUpdateRole;
exports.isAuthorizedToUpdateEmployee = isAuthorizedToUpdateEmployee;
exports.isRoleGreater = isRoleGreater;
exports.getHighestGroup = getHighestGroup;
exports.getHighestRole = getHighestRole;
