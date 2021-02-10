const {
  OWNER_ROLE,
  ADMIN_ROLE,
  MANAGER_ROLE,
  DEFAULT_EMPLOYEE_ROLE: EMPLOYEE_ROLE,
  isAuthorizedToUpdateEmployee,
  isAuthorizedToUpdateRole,
} = require("../authentication");

const company1Id = "72770c3c-cacf-4bb9-81ce-67d191ddf6b1";
const company2Id = "72770c3c-cacf-4bb9-81ce-67d191ddf6b2";
const employeeId1 = "72770c3c-cacf-4bb9-81ce-67d191ddf6E1";
const employeeId2 = "72770c3c-cacf-4bb9-81ce-67d191ddf6E2";

test("isUserAuthorized to Update Employee Record", () => {
  /**
   * Testing owner level
   */
  // Company Owner can update anyone, even other owners
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${OWNER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: [],
      }
    ).authorized
  ).toBeTruthy();
  // Company Owner cannont update another company
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${OWNER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "any",
        companyId: company2Id,
        managerIds: [],
      }
    ).authorized
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [
          `${EMPLOYEE_ROLE}-${company2Id}`,
          `${OWNER_ROLE}-${company2Id}`,
        ],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: [],
      }
    ).authorized
  ).toBeFalsy();
  // An employee can update itself
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${EMPLOYEE_ROLE}-${company1Id}`],
      },
      {
        id: employeeId1,
        roles: [EMPLOYEE_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: [],
      }
    ).authorized
  ).toBeTruthy();
  // Unless they now belong to a different company
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${EMPLOYEE_ROLE}-${company1Id}`],
      },
      {
        id: employeeId1,
        roles: [EMPLOYEE_ROLE],
        primaryManagerId: "any",
        companyId: company2Id,
        managerIds: [],
      }
    ).authorized
  ).toBeFalsy();
  // Employee cannot update another employee
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${EMPLOYEE_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [EMPLOYEE_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: [],
      }
    ).authorized
  ).toBeFalsy();
  // Admins can update anyone within their company
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${ADMIN_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: [],
      }
    ).authorized
  ).toBeTruthy();
  // Manager cannot update anyone else they manage them
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: ["not-a-real-id"],
      }
    ).authorized
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: ["not-a-real-id"],
      }
    ).authorized
  ).toBeTruthy();
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: ["not-a-real-id", employeeId1],
      }
    ).authorized
  ).toBeTruthy();
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "any",
        companyId: company1Id,
        managerIds: ["not-a-real-id", employeeId1],
      }
    ).authorized
  ).toBeTruthy();
  // Manager role needs to be from same company
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company2Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: ["not-a-real-id", employeeId1],
      }
    ).authorized
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateEmployee(
      {
        eId: employeeId1,
        cId: company2Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: ["not-a-real-id", employeeId1],
      }
    ).authorized
  ).toBeFalsy();
});

test("isAuthorizedToUpdateRole", () => {
  // User cannot change their own role
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${OWNER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId1,
        roles: [OWNER_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: [],
      },
      EMPLOYEE_ROLE
    )
  ).toBeFalsy();
  // Employee's cannont change roles
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${EMPLOYEE_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [EMPLOYEE_ROLE],
        primaryManagerId: "Any",
        companyId: company1Id,
        managerIds: [],
      },
      EMPLOYEE_ROLE
    )
  ).toBeFalsy();
  // Another owner can change another owners role
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${OWNER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "Any",
        companyId: company1Id,
        managerIds: [],
      },
      EMPLOYEE_ROLE
    )
  ).toBeTruthy();
  // .. but the role must be real
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${OWNER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "Any",
        companyId: company1Id,
        managerIds: [],
      },
      "Super Admin"
    )
  ).toBeFalsy();
  // An Admin cannont change an owners and a manager cannont change an admin/owner
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${ADMIN_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [OWNER_ROLE],
        primaryManagerId: "Any",
        companyId: company1Id,
        managerIds: [],
      },
      OWNER_ROLE
    )
  ).toBeFalsy();
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [ADMIN_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: [],
      },
      EMPLOYEE_ROLE
    )
  ).toBeFalsy();
  // Manager can demote a manager it manages
  expect(
    isAuthorizedToUpdateRole(
      {
        eId: employeeId1,
        cId: company1Id,
        "cognito:groups": [`${MANAGER_ROLE}-${company1Id}`],
      },
      {
        id: employeeId2,
        roles: [MANAGER_ROLE],
        primaryManagerId: employeeId1,
        companyId: company1Id,
        managerIds: [],
      },
      EMPLOYEE_ROLE
    )
  ).toBeTruthy();
});
