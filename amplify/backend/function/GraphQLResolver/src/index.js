/* Amplify Params - DO NOT EDIT
	API_ITIEMPO_GRAPHQLAPIENDPOINTOUTPUT
	API_ITIEMPO_GRAPHQLAPIIDOUTPUT
	AUTH_AUTH_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const api = require("./api");
const user = require("./cognito-user");
const uuid = require("uuid");

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
 *
 * @param {*} requestorClaims
 * @param {*} employee
 * @param {*} newRole
 */
const isAuthorizedToUpdateRole = (requestorClaims, employee, newRole) => {
  const { eId, cId, "cognito:groups": requestorsRoleArr } = requestorClaims;
  const { roles, primaryManagerId, companyId } = employee;

  // Extract the highest assigned role of the requester (logged in usr)
  let requestorsRole = DEFAULT_EMPLOYEE_ROLE;
  requestorsRoleArr.forEach((r) => {
    // Ex: r = 'Owner-a03dc17c-a10c-437d-84de-35b5f0a675e5'
    const [rName] = r.split("-");
    const [, compId] = r.split(`${rName}-`);
    if (compId === cId) {
      // Choose the highest weight role
      if (ROLE_Weight[rName] > ROLE_Weight[requestorsRole]) {
        requestorsRole = r;
      }
    }
  });
  // Extract the highest role of the employee record being updated
  let employeeCurRole = DEFAULT_EMPLOYEE_ROLE;
  roles.forEach((r) => {
    // Choose the highest weight role
    if (ROLE_Weight[r] > ROLE_Weight[employeeCurRole]) {
      employeeCurRole = r;
    }
  });

  // Making sure the requetor is not hacking into another company
  if (cId !== companyId) return false;

  // Users with Role Employee are never authorized
  if (requestorsRole === DEFAULT_EMPLOYEE_ROLE) return false;

  // Making sure a manager is only updating their employee
  if (requestorsRole === MANAGER_ROLE && eId !== primaryManagerId) return false;

  // Making sure the role of the requester is not beneath the targeted employee
  if (ROLE_Weight[requestorsRole] < ROLE_Weight[employeeCurRole]) return false;

  // Making sure the requeater is not attempting to assign a role higher than its own
  if (ROLE_Weight[newRole] > ROLE_Weight[requestorsRole]) return false;

  return true;
};

/**
 * Includes cId, eId, and roles
 */
const getAppsCustomUserAttributes = () => [
  {
    AttributeDataType: "string",
    DeveloperOnlyAttribute: false,
    Mutable: true,
    Name: "cId",
    Required: false,
    StringAttributeConstraints: {
      MaxLength: "255",
      MinLength: "0",
    },
  },
  {
    AttributeDataType: "string",
    DeveloperOnlyAttribute: false,
    Mutable: true,
    Name: "eId",
    Required: false,
    StringAttributeConstraints: {
      MaxLength: "255",
      MinLength: "0",
    },
  },
  {
    AttributeDataType: "string",
    DeveloperOnlyAttribute: false,
    Mutable: true,
    Name: "roles",
    Required: false,
    StringAttributeConstraints: {
      MaxLength: "255",
      MinLength: "0",
    },
  },
];

/**
 * Using this as the entry point,
 * you can use a single function to handle many resolvers.
 */
const resolvers = {
  Mutation: {
    setupNewAccount: async (ctx) => {
      const { claims } = ctx.identity;
      const { cId, eId, email, username: u1 } = claims;
      // Username is found differently depending on the context
      const username = u1 || claims["cognito:username"];
      // Make sure this account is an owner account
      const cognitoGroup = claims["cognito:groups"] || [];
      if (!cognitoGroup.includes(`${OWNER_ROLE}-${cId}`)) {
        throw new Error("Unauthroized account setup");
      }

      // New Employee data
      const employeeVars = {
        input: {
          id: eId,
          username,
          email,
          roles: [OWNER_ROLE],
          companyId: cId,
          primaryManagerId: eId, // They are their own manager at 1st
          allowFull: [`${OWNER_ROLE}-${cId}`, `${ADMIN_ROLE}-${cId}`],
        },
      };
      // New company data
      const companyVars = {
        input: {
          id: cId,
          allowUpdate: [`${OWNER_ROLE}-${cId}`, `${ADMIN_ROLE}-${cId}`],
        },
      };

      // Create the new Company
      const companyPromise = api.CreateCompany(companyVars);
      // Create the new Employee
      const employeePromise = api.CreateEmployee(employeeVars);
      // Persist the companyId, employeeId and Role to the Cognito user rec.
      const updateUsr = () =>
        // We wrapped the function call because we may call a 2nd time later
        user.updateUser(username, [
          { Name: "custom:cId", Value: cId },
          { Name: "custom:eId", Value: eId },
          // Assign the user to the Owner group for this new company
          { Name: "custom:roles", Value: OWNER_ROLE },
        ]);
      const updateUserPromise = updateUsr();

      // Asynchronously create Employee, Company and update user role
      const [companyRes, employeeRes, userRes] = await Promise.all([
        companyPromise
          .then((r) => {
            if (!r || r.errors) throw new Error("Company may already exist");
            return r;
          })
          .catch(async (error) => {
            console.error(error);
            try {
              // Perhaps the company was already created
              const { data: { getCompany } = {} } =
                (await api.GetCompany(cId)) || {};
              return !getCompany
                ? null
                : { data: { createCompany: getCompany } };
            } catch (e) {
              console.error(e);
              return null;
            }
          }),
        employeePromise
          .then((r) => {
            if (!r || r.errors) throw new Error("Employee may already exist");
            return r;
          })
          .catch(async (error) => {
            console.error(error);
            try {
              // Perhaps the Employee was already created
              const { data: { getEmployee } = {} } =
                (await api.GetEmployee(eId)) || {};
              return !getEmployee
                ? null
                : { data: { createEmployee: getEmployee } };
            } catch (e) {
              console.error(e);
              return null;
            }
          }),
        updateUserPromise.catch(async (error) => {
          // Perhaps this is a new user pool and we need to create the
          // custom attributes first
          console.log("Creating missing attributes", error);
          try {
            await user.addCustomAttributes(getAppsCustomUserAttributes());
            return await updateUsr();
          } catch (e) {
            console.error(e);
            return null;
          }
        }),
      ]);

      // TODO (Matthew): Can we handle these (allbeit rare) errors better?
      if (!companyRes) throw new Error("Could not create Company");
      if (!employeeRes) throw new Error("Could not create Employee");
      if (!userRes) throw new Error("Could not update User");

      // console.log(JSON.stringify(companyRes, null, 4));
      // console.log(JSON.stringify(employeeRes, null, 4));
      // console.log(JSON.stringify(userRes, null, 4));

      return employeeRes.data.createEmployee;
    },
    createUser: async (ctx) => {
      // TODO (Matthew): If the function doesn't complete then there is the
      // potential that a new user was created with an eId before the
      // corrosponding employee with that eId was also created

      // GraphQL arguments from client
      const { input } = ctx.arguments;
      // User must belong to same company (cId)
      const { cId, eId: pManagerId } = ctx.identity.claims;
      const eId = uuid.v4(); // Will be Employee.id
      const {
        email,
        roles = [DEFAULT_EMPLOYEE_ROLE],
        primaryManagerId = pManagerId,
      } = input;

      // Loop through the role being asigned and make sure
      // the requestor is authorized to assign each role
      const mockEmployee = {
        roles: [DEFAULT_EMPLOYEE_ROLE],
        primaryManagerId,
        companyId: cId,
      };
      const roleAuthorized = roles.reduce(
        (accum, role) =>
          accum &&
          isAuthorizedToUpdateRole(ctx.identity.claims, mockEmployee, role),
        true
      );
      // Throw violation
      if (!roleAuthorized) throw new Error("Role authorization error");

      const UserAttributes = [
        { Name: "custom:cId", Value: cId },
        { Name: "custom:eId", Value: eId },
        // Transform roles array to comma seperated list of roles
        { Name: "custom:roles", Value: roles.reduce((a, c) => `${a},${c}`) },
      ];

      // Create the user
      const { User } = await user.createUser(email, UserAttributes);

      if (User && User.Username) {
        // create an employee record linking it to the new user
        const { data } = await api.CreateEmployee({
          input: {
            ...input,
            id: eId,
            username: User.Username,
            email,
            companyId: cId,
            primaryManagerId,
            roles,
            allowFull: [`${OWNER_ROLE}-${cId}`, `${ADMIN_ROLE}-${cId}`],
          },
        });

        if (data && data.createEmployee) {
          return data.createEmployee;
        } else {
          throw new Error("Failed to create new Employee");
        }
      } else {
        throw new Error("Failed to create new User");
      }
    },
    updateUserRole: async (ctx) => {
      // GraphQL arguments from client
      const {
        username,
        employeeId,
        managerIds,
        roles,
        previousRoles,
        _version,
      } = ctx.arguments;
      // The requesters signed identity claims
      const { cId } = ctx.identity.claims;

      // Loop through the role being asigned and make sure
      // the requestor is authorized to assign each role
      const mockEmployee = {
        roles: previousRoles,
        primaryManagerId: managerIds[0],
        companyId: cId,
      };
      const roleAuthorized = roles.reduce(
        (accum, role) =>
          accum &&
          isAuthorizedToUpdateRole(ctx.identity.claims, mockEmployee, role),
        true
      );
      // Throw violation
      if (!roleAuthorized) throw new Error("Role authorization error");

      const UserAttributes = [
        // Transform roles array to comma seperated list of roles
        { Name: "custom:roles", Value: roles.reduce((a, c) => `${a},${c}`) },
      ];

      // Update Cognito User
      const updateUserPromise = user.updateUser(username, UserAttributes);
      // Update Employee Record
      const updateEmployeePromise = api.UpdateEmployee({
        input: {
          id: employeeId,
          roles,
          _version,
        },
        condition: {
          and: [
            { username: { eq: username } },
            { companyId: { eq: cId } },
            ...previousRoles.map((r) => {
              return { roles: { contains: r } };
            }),
            // TODO: Add managers
          ],
        },
      });
      // Asynchronously update User and Employee role
      const [userRes, employeeRes] = await Promise.all([
        updateUserPromise.catch((error) => {
          console.error(error);
          return null;
        }),
        updateEmployeePromise.catch((error) => {
          console.error(error);
          return null;
        }),
      ]);

      // TODO (Matthew): Can we handle these (allbeit rare) errors better?
      if (!userRes) throw new Error("Could not update user");
      if (!employeeRes || (employeeRes && !employeeRes.data.updateEmployee)) {
        const { errors } = employeeRes || {};
        if (errors && errors[0] && errors[0].message) {
          throw new Error(errors[0].message);
        } else {
          throw new Error("Could not update Employee");
        }
      }
      console.log(JSON.stringify(employeeRes.data, null, 4)); // for testing

      return employeeRes.data.updateEmployee;
    },
  },
};

// event
// {
//   "typeName": "Query", /* Filled dynamically based on @function usage location */
//   "fieldName": "me", /* Filled dynamically based on @function usage location */
//   "arguments": { /* GraphQL field arguments via $ctx.arguments */ },
//   "identity": { /* AppSync identity object via $ctx.identity */ },
//   "source": { /* The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object. */ },
//   "request": { /* AppSync request object. Contains things like headers. */ },
//   "prev": { /* If using the built-in pipeline resolver support, this contains the object returned by the previous function. */ },
// }
exports.handler = async (event) => {
  // Log every request while under development
  console.info(JSON.stringify(event, null, 4));
  try {
    const typeHandler = resolvers[event.typeName];
    if (typeHandler) {
      const resolver = typeHandler[event.fieldName];
      if (resolver) {
        return await resolver(event);
      }
    }
    throw new Error(
      "Resolver not found. Forget to implement?" +
        event.typeName +
        ". " +
        event.fieldName
    );
  } catch (e) {
    console.error(e, JSON.stringify(event, null, 4));
    throw e;
  }
};
