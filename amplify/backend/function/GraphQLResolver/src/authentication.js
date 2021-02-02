const OWNER_ROLE = "Owner";
const ADMIN_ROLE = "Admin";
const MANAGER_ROLE = "Manager";
const DEFAULT_EMPLOYEE_ROLE = "Employee";
// eslint-disable-next-line no-unused-vars
const ROLE_Weight = {
  [OWNER_ROLE]: 4,
  [ADMIN_ROLE]: 3,
  [MANAGER_ROLE]: 2,
  [DEFAULT_EMPLOYEE_ROLE]: 1,
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
 *  different company, has role employee, or role manager and
 *  isn't the primary manager, or one of the employees other managers;
 *  otherwise true
 */
const _authorizedToUpdate = (requestorClaims, employee) => {
  const { eId, cId, "cognito:groups": requestorsRoleArr } = requestorClaims;
  const { roles, primaryManagerId, companyId, managerIds = [] } = employee;

  // Extract the highest assigned role of the requester (logged in usr)
  let requestorsHighestRole = DEFAULT_EMPLOYEE_ROLE;
  requestorsRoleArr.forEach((r) => {
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

  // Extract the highest role of the employee record being updated
  let employeesHighestRole = DEFAULT_EMPLOYEE_ROLE;
  roles.forEach((r) => {
    // Choose the highest weight role
    if (ROLE_Weight[r] > ROLE_Weight[employeesHighestRole]) {
      employeesHighestRole = r;
    }
  });

  const retVal = { requestorsHighestRole, employeesHighestRole };

  // Making sure the requetor is not hacking into another company
  if (cId !== companyId) return { ...retVal, authorized: false };

  // Users with Role Employee are never authorized (in these contexts)
  if (requestorsHighestRole === DEFAULT_EMPLOYEE_ROLE)
    return { ...retVal, authorized: false };

  // Making sure a manager is only updating their employee
  // Note their employee could also be an admin or owner and this still passes
  if (
    requestorsHighestRole === MANAGER_ROLE &&
    ![primaryManagerId, ...managerIds].includes(eId)
  )
    return { ...retVal, authorized: false };

  // Everyone above a manager is authorized
  // Passed all test
  return { ...retVal, authorized: true };
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
  const { eId } = requestorClaims;
  const { id } = employee;
  const {
    requestorsHighestRole,
    employeesHighestRole,
    authorized,
  } = _authorizedToUpdate(requestorClaims, employee);

  if (!authorized) return false;

  // Don't let a user change their own
  if (eId === id) return false;
  
  // Making sure the role of the requester is not beneath the targeted employee
  if (ROLE_Weight[requestorsHighestRole] < ROLE_Weight[employeesHighestRole])
    return false;

  // Making sure the requeater is not attempting to assign a role higher than its own
  if (ROLE_Weight[newRole] > ROLE_Weight[requestorsHighestRole]) return false;

  return true;
};

exports.OWNER_ROLE = OWNER_ROLE;
exports.ADMIN_ROLE = ADMIN_ROLE;
exports.MANAGER_ROLE = MANAGER_ROLE;
exports.DEFAULT_EMPLOYEE_ROLE = DEFAULT_EMPLOYEE_ROLE;
exports.isAuthorizedToUpdateRole = isAuthorizedToUpdateRole;
