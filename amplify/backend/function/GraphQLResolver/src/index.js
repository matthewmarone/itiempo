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
const {
  OWNER_ROLE,
  ADMIN_ROLE,
  MANAGER_ROLE,
  ACCOUNTANT_ROLE,
  DEFAULT_EMPLOYEE_ROLE,
  isAuthorizedToUpdateEmployee,
  isAuthorizedToUpdateRole,
  isRoleGreater,
} = require("./authentication");

/**
 * Includes cId, eId, and roles
 */
const getAppsCustomUserAttributes = () => [
  {
    AttributeDataType: "String",
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
    AttributeDataType: "String",
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
    AttributeDataType: "String",
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
          email, // email should be lower case at signup
          roles: [OWNER_ROLE],
          companyId: cId,
          primaryManagerId: eId, // They are their own manager at 1st
          allowRead: [`${ACCOUNTANT_ROLE}-${cId}`],
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
        user.updateUserAttributes(username, [
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
      // GraphQL arguments from client
      const { input } = ctx.arguments;
      // User must belong to same company (cId)
      const { cId, eId: pManagerId } = ctx.identity.claims;
      const eId = uuid.v4(); // Will be Employee.id
      const {
        roles = [DEFAULT_EMPLOYEE_ROLE],
        // Default current user to be primary manager
        primaryManagerId = pManagerId,
      } = input;
      const email = input.email.toLowerCase();

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
      if (!roleAuthorized) throw new Error("Unauthorized to assign role");

      const UserAttributes = [
        { Name: "custom:cId", Value: cId },
        { Name: "custom:eId", Value: eId },
        // Transform roles array to comma seperated list of roles
        { Name: "custom:roles", Value: roles.reduce((a, c) => `${a},${c}`) },
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
      ];

      // Attempt to create the user, the employeeId is also returned here
      // in the rare case that this is the second attempt and the user was created
      // before with a different employeeId because
      // the first attempt didn't fully complete, like if the API was down, etc.
      const username = await user
        .createUser(email, UserAttributes)
        .then(({ User: { Username } }) => Username)
        .catch(async (e) => {
          // Something went wrong creating a new user
          // Handle this exception gracfully
          if (e.name === "UsernameExistsException") {
            // Let's lookup the user and see for which company it belongs to
            // and if there already is an associated Employee record
            const { Username, UserAttributes: UA = [] } = await user.getUser(
              email
            );
            const { companyId, employeeId } = UA.reduce(
              (retVal, { Name, Value }) => {
                switch (Name) {
                  case "custom:cId":
                    return { ...retVal, companyId: Value };
                  case "custom:eId":
                    return { ...retVal, employeeId: Value };
                  default:
                    return retVal;
                }
              },
              {}
            );
            // Check that the user belongs to this company
            if (cId !== companyId) throw new Error("Account already exists");
            // Perhaps this is a subsequent request for a previously added employee
            // So let's see if it exists
            const { data: { getEmployee } = {} } = await api.GetEmployee(
              employeeId
            );
            if (getEmployee) throw new Error("Employee already exists");
            // Lastly,
            // A rare case where the user was created but the sequence didn't finish
            // creating the associated employee the first time
            // So let's create the employee & update the user's employeeId and role
            // to be whatever is in this final request
            console.warn("Rare exception has occurred, attempting to recover");
            user.globalSignOut(Username).catch((e) => console.error(e));
            // This is safe because we already checked the companyId
            // and confirmed that the employee record was not in existance
            await user.updateUserAttributes(Username, UserAttributes);
            // Return the Username
            return Username;
          } else {
            // Other resons we can not handle gracfully
            console.error("User could not be created", e);
            throw e;
          }
        });

      // create an employee record linking it to the new user
      const { data } = await api.CreateEmployee({
        input: {
          ...input,
          id: eId,
          username,
          email,
          companyId: cId,
          primaryManagerId,
          roles,
          allowRead: [`${ACCOUNTANT_ROLE}-${cId}`],
          allowFull: [`${OWNER_ROLE}-${cId}`, `${ADMIN_ROLE}-${cId}`],
        },
      });

      if (data && data.createEmployee) {
        return data.createEmployee;
      } else {
        throw new Error("Failed to create new Employee");
      }
    },
    updateEmpl: async (ctx) => {
      const {
        identity: { claims },
        arguments: { input: employeeInput },
      } = ctx;
      const {
        requestorsHighestRole,
        // employeesHighestRole,
        authorized,
      } = isAuthorizedToUpdateEmployee(claims, employeeInput);
      if (!authorized) {
        console.warn(
          "Unauthorized to update employee",
          JSON.stringify(ctx, null, 4)
        );
        throw new Error("Unauthorized to update employee");
      }
      // GraphQL arguments from client
      // Remvoe the fields that this resolver shouldn't update
      // This allowed the client to easily pass all employee fields if it wished
      const {
        username,
        email,
        roles,
        updateRoles,
        companyId,
        allowRead,
        allowFull,
        inactive,
        _deleted,
        _lastChangedAt,
        createdAt,
        updatedAt,
        ...updateFields
      } = employeeInput;
      const input = isRoleGreater(requestorsHighestRole, DEFAULT_EMPLOYEE_ROLE)
        ? updateFields
        : {
            ...updateFields,
            // All these require management level or higher
            jobTitle: undefined,
            payRates: undefined,
            primaryManagerId: undefined,
            managerIds: undefined,
          };

      const doRoleUpdate =
        updateRoles &&
        updateRoles.reduce(
          (accum, role) =>
            accum && isAuthorizedToUpdateRole(claims, employeeInput, role),
          true
        );

      if (doRoleUpdate) input.roles = updateRoles;

      const { cId, eId } = claims;
      const condition = {
        and: [
          { username: { eq: username } },
          { companyId: { eq: cId } },
          ...roles.map((r) => {
            return { roles: { contains: r } };
          }),
        ],
      };
      // Add a check for the manager if the requestor is a manager
      if (requestorsHighestRole === MANAGER_ROLE) {
        condition.and[condition.and.length] = {
          or: [
            { primaryManagerId: { eq: eId } },
            { managerIds: { contains: eId } },
          ],
        };
      }

      console.log(JSON.stringify({ input, condition }, null, 4));

      const {
        data: { updateEmployee } = {},
        errors,
      } = await api.UpdateEmployee({ input, condition });

      // console.log(JSON.stringify({ updateEmployee, errors }, null, 4)); // for testing

      if (errors || !updateEmployee) {
        console.warn(errors);
        if (!updateEmployee) {
          const errorMessage = `Update employee Failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }

      if (doRoleUpdate) {
        // Update the cognito user as well
        const Value = updateRoles.reduce((a, c) => `${a},${c}`);
        const UserAttributes = [
          // Transform roles array to comma seperated list of roles
          {
            Name: "custom:roles",
            Value,
          },
        ];

        // Update Cognito User
        user
          .updateUserAttributes(username, UserAttributes)
          .then(() => user.globalSignOut(username))
          .catch(
            (e) =>
              console.error(
                `Failed to update user role (${username}) to ${Value}`,
                e
              )
            // TODO (Matt) reset roles on employee record
          );
      }

      return updateEmployee;
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
