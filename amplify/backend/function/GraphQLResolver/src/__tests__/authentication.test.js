const {
  OWNER_ROLE,
  ADMIN_ROLE,
  MANAGER_ROLE,
  DEFAULT_EMPLOYEE_ROLE: EMPLOYEE_ROLE,
  isAuthorizedToUpdateRole,
} = require("../authentication");

const company1 = "72770c3c-cacf-4bb9-81ce-67d191ddf6b1";
const company2 = "72770c3c-cacf-4bb9-81ce-67d191ddf6b2";
const c1_owner = {
  cId: company1,
  eId: "e4d8cd57-aeba-4927-a6eb-e0bf515a6711",
  "cognito:groups": [`${OWNER_ROLE}-${company1}`],
};
const c1_admin = {
  cId: company1,
  eId: "e4d8cd57-aeba-4927-a6eb-e0bf515a6712",
  "cognito:groups": [`${ADMIN_ROLE}-${company1}`],
};
const c1_manager = {
  cId: company1,
  eId: "e4d8cd57-aeba-4927-a6eb-e0bf515a6713",
  "cognito:groups": [`${MANAGER_ROLE}-${company1}`],
};
const c1_employee = {
  cId: company1,
  eId: "e4d8cd57-aeba-4927-a6eb-e0bf515a6714",
  "cognito:groups": [`${EMPLOYEE_ROLE}-${company1}`],
};
const c2_employee = {
  cId: company2,
  eId: "e4d8cd57-aeba-4927-a6eb-e0bf515a6721",
  "cognito:groups": [`${EMPLOYEE_ROLE}-${company2}`],
};

test("isAuthorizedToUpdateRole", () => {
    // TODO (Matt): Review that these tests are complete and acurate
  const employeeC1 = {
    id: c1_employee.eId,
    roles: [EMPLOYEE_ROLE],
    primaryManagerId: c1_owner.eId, // I guess could happen if user switched accts.
    companyId: c1_employee.cId,
  };
  const employeeC2 = {
    id: c2_employee.eId,
    roles: [EMPLOYEE_ROLE],
    primaryManagerId: c1_owner.eId, // I guess could happen if user switched accts.
    companyId: c2_employee.cId,
  };
  // Checking that one company' user cannont update another company's employee
  expect(
    isAuthorizedToUpdateRole(c1_owner, employeeC2, EMPLOYEE_ROLE)
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(c1_admin, employeeC2, EMPLOYEE_ROLE)
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(c1_manager, employeeC2, EMPLOYEE_ROLE)
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(c1_employee, employeeC2, EMPLOYEE_ROLE)
  ).toBeFalsy();
  // Testing that an employee is never authorized
  expect(
    isAuthorizedToUpdateRole(c1_employee, employeeC1, EMPLOYEE_ROLE)
  ).toBeFalsy();
//   Testing that a manager only updates their own employee
  expect(
    isAuthorizedToUpdateRole(c1_manager, employeeC1, MANAGER_ROLE)
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(
      c1_manager,
      { ...employeeC1, managerIds: ["fake-id"] },
      MANAGER_ROLE
    )
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(
      c1_manager,
      { ...employeeC1, managerIds: [c1_manager.eId, "fake-id"] },
      MANAGER_ROLE
    )
  ).toBeTruthy();
  expect(
    isAuthorizedToUpdateRole(
      c1_manager,
      { ...employeeC1, primaryManagerId: c1_manager.eId },
      MANAGER_ROLE
    )
  ).toBeTruthy();
  // Testing that no one can assign a role greater than their own
  expect(
    isAuthorizedToUpdateRole(
      c1_manager,
      { ...employeeC1, primaryManagerId: c1_manager.eId },
      ADMIN_ROLE
    )
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(c1_admin, employeeC1, OWNER_ROLE)
  ).toBeFalsy();
  // Testing that no one can move someone down if they are not at the same role
  // or higher
  expect(
    isAuthorizedToUpdateRole(
      c1_admin,
      { ...employeeC1, roles: [OWNER_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE] },
      ADMIN_ROLE
    )
  ).toBeFalsy();
  // Testing that you can't change your own role
  expect(
    isAuthorizedToUpdateRole(
      c1_owner,
      {
        id: c1_owner.eId,
        companyId: c1_owner.cId,
        roles: [OWNER_ROLE],
        primaryManagerId: c1_owner.eId, // I guess could happen if user switched accts.
        managerIds: [c1_owner.eId],
      },
      ADMIN_ROLE
    )
  ).toBeFalsy();
});
