/* Amplify Params - DO NOT EDIT
	API_ITIEMPO_GRAPHQLAPIENDPOINTOUTPUT
	API_ITIEMPO_GRAPHQLAPIIDOUTPUT
	AUTH_USERS_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const api = require("./api");
const user = require("./cognito-user");
const uuid = require("uuid");
const ses = require("./ses");
const { removeSensitive } = require("./logging");
const { EmployeeLookup } = require("./employeeLookup");
const { createIdent, compareIdent } = require("./ident");
const {
  OWNER_ROLE,
  ADMIN_ROLE,
  MANAGER_ROLE,
  ACCOUNTANT_ROLE,
  DEFAULT_EMPLOYEE_ROLE,
  isAuthorizedToUpdateEmployee,
  isAuthorizedToUpdateRole,
  isRoleGreater,
  getHighestGroup,
  isValidPassword,
  createTemporaryPassword,
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

const PunchMethod = {
  TimeClock: "TimeClock",
  Manual: "Manual",
};

/**
 * Using this as the entry point,
 * you can use a single function to handle many resolvers.
 */
const resolvers = {
  Query: {
    employeePayRates: async (ctx) => {
      const {
        arguments: { employeeId: eId },
      } = ctx;

      // Perhaps the Employee was already created
      const { data: { getEmployee } = {} } = (await api.GetEmployee(eId)) || {};

      if (!getEmployee)
        console.warn(
          `Requested employeeId ${eId} does not exist, this should not happen often.`
        );

      // Reduce payrates just down to its names, or return an empty array
      const retVal =
        getEmployee && getEmployee.payRates
          ? getEmployee.payRates.map((p) => p.name)
          : [];

      return retVal;
    },
    quickClockIn: async (ctx) => {
      const {
        arguments: { companyId: cIdIn, limit, nextToken: ntIn },
      } = ctx;

      const { data, errors } =
        (await api.ListQuickPunchByCompany({
          companyId: cIdIn,
          limit,
          nextToken: ntIn,
        })) || {};
      console.log(JSON.stringify({ data, errors }, null, 4));
      const { listQuickPunchByCompany } = data || {};
      if (errors || !listQuickPunchByCompany) {
        console.warn(errors);
        if (!listQuickPunchByCompany) {
          const errorMessage = `listQuickPunchByCompany faild: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }

      const { items, nextToken, startedAt } = listQuickPunchByCompany;
      const retVal = {
        items: (items || []).reduce(
          (accum, { companyId, employeeId, id, nickName, _deleted }) => {
            if (!_deleted)
              accum[accum.length] = { id, companyId, employeeId, nickName };
            return accum;
          },
          []
        ),
        nextToken,
        startedAt,
      };

      console.log(JSON.stringify(retVal, null, 4));
      return JSON.stringify(retVal);
    },
    timeRecordReport: async (ctx) => {
      const {
        identity: {
          claims: { eId, cId: companyId, "cognito:groups": cognitoGroup },
        },
        arguments: {
          filter: { from, to, limitByEmployeeId },
          limit,
          nextToken,
        },
      } = ctx;

      const role = getHighestGroup(cognitoGroup, companyId);
      if (!isRoleGreater(role, DEFAULT_EMPLOYEE_ROLE))
        throw new Error("Unautorized: Requires higher privlages");

      // Filter by employee id, if limitByEmployeeId
      // TODO (): Is there a dynomo DB limit to the number of id's that can be filtered
      const filter =
        (limitByEmployeeId || []).length > 0
          ? {
              or: limitByEmployeeId.map((id) => {
                return { employeeId: { eq: id } };
              }),
            }
          : undefined;
      const variables = {
        companyId,
        filter,
        limit,
        nextToken,
        sortDirection: "DESC",
        timestampIn: { between: [from, to] },
      };

      console.log(JSON.stringify(variables, null, 4));

      const { data, errors } =
        (await api.ListCompanyTimeRecords(variables)) || {};
      const { listCompanyTimeRecords } = data || {};
      if (errors || !listCompanyTimeRecords) {
        console.warn(errors);
        if (!listCompanyTimeRecords) {
          const errorMessage = `TimeRecordReport faild: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }
      if (!isRoleGreater(role, MANAGER_ROLE) && listCompanyTimeRecords.items) {
        // We need to filter records down to only the managers's own records and
        // subordenents' records.
        const employeeMap = new EmployeeLookup();
        const filteredItems = [];

        for (const timeRecord of listCompanyTimeRecords.items) {
          const { employeeId } = timeRecord;
          const employee = await employeeMap.getEmployee(employeeId);
          // console.log(employee);
          const { id, primaryManagerId, managerIds } = employee || {};
          if ([id, primaryManagerId, ...(managerIds || [])].includes(eId)) {
            filteredItems[filteredItems.length] = timeRecord;
          } else if (employee) {
            // console.log("filtered out employee", employee);
          } else {
            throw new Error(
              "Time Record exisits for non-exisiting employee",
              employeeId
            );
          }
        }

        listCompanyTimeRecords.items = filteredItems;
      }
      return listCompanyTimeRecords;
    },
  },
  Mutation: {
    deleteTimeRec: async (ctx) => {
      const {
        arguments: {
          input: { id, employeeId, companyId, _version },
        },
      } = ctx;
      console.log("Should run verificatin with ", employeeId, companyId);
      const input = { id, _version };
      const { data, errors } = (await api.DeleteTimeRecord({ input })) || {};
      const { deleteTimeRecord } = data || {};
      if (errors || !deleteTimeRecord) {
        console.warn(errors);
        if (!deleteTimeRecord) {
          const errorMessage = `Clock-out failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }
      return deleteTimeRecord;
    },
    punchInByPin: async (ctx) => {
      const {
        identity: { sourceIp },
        arguments: {
          input: { quickPunchId, base64Ident, punchCardDetails, rateName },
        },
      } = ctx;
      // This will be the clock in our out time
      const timestamp = Math.round(new Date().getTime() / 1000);

      const { data: { getQuickPunch } = {} } =
        (await api.GetQuickPunch(quickPunchId)) || {};

      if (!getQuickPunch) throw new Error("Quick Punch Rec does not exist");

      const { companyId, employeeId, ident } = getQuickPunch;

      const isMatchPromise = compareIdent(base64Ident, companyId, ident);
      const timeRecordPromise = api.ListEmployeeTimeRecords({
        employeeId,
        limit: 3,
        sortDirection: "DESC",
      });
      const employeePromise = api.GetEmployee(employeeId);

      const [match, lastRecord, rate] = await Promise.all([
        isMatchPromise.catch((e) => {
          console.error("Failed to compare ident:", e);
          return false;
        }),
        timeRecordPromise
          .then(({ data, errors }) => {
            if (errors) {
              console.error(errors);
              const errorMessage = `Clock-in failed: ${
                !errors || !errors[0] || errors[0].message
              }`;
              console.error(errorMessage);
              throw new Error("Failed to lookup timerecord");
            }
            const { listEmployeeTimeRecords: { items } = {} } = data || {};
            // TODO (BL-I18): What if more than three have been deleted?
            return items && items.length > 0
              ? items.find((i) => !i._deleted)
              : null;
          })
          .catch((e) => {
            const msg = "Failed to lookup timerecord";
            console.error(msg, e);
            throw new Error(msg);
          }),
        employeePromise
          .then(({ data }) => {
            const { getEmployee } = data || {};
            return getEmployee && getEmployee.payRates
              ? getEmployee.payRates.find((v) => v.name === rateName)
              : undefined;
          })
          .catch((e) => {
            const msg = "Failed to validate employee pay rate";
            console.error(msg, e);
            throw new Error(msg);
          }),
      ]);

      if (!match) throw new Error("Incorrect Pin:");

      const { id, timestampOut, _version } = lastRecord || {};

      if (!timestampOut && id) {
        // Clock Out
        const clockOutDetails = {
          ...punchCardDetails,
          punchMethod: PunchMethod.TimeClock,
          createdBy: employeeId,
          ipAddress: sourceIp && sourceIp.length > 0 ? sourceIp[0] : undefined,
        };
        const input = {
          id,
          employeeId,
          companyId,
          timestampOut: timestamp,
          clockOutDetails,
          _version,
        };

        console.log(JSON.stringify(input, null, 4));

        const { data, errors } = (await api.UpdateTimeRecord({ input })) || {};
        const { updateTimeRecord } = data || {};
        if (errors || !updateTimeRecord) {
          console.warn(errors);
          if (!updateTimeRecord) {
            const errorMessage = `Clock-out failed: ${
              !errors || !errors[0] || errors[0].message
            }`;
            throw new Error(errorMessage);
          }
        }
        return JSON.stringify(updateTimeRecord);
      } else {
        //Clock in
        const clockInDetails = {
          ...punchCardDetails,
          punchMethod: PunchMethod.TimeClock,
          createdBy: employeeId,
          ipAddress: sourceIp && sourceIp.length > 0 ? sourceIp[0] : undefined,
        };
        if (rate) delete rate.__typename;
        const input = {
          employeeId,
          companyId,
          timestampIn: timestamp,
          clockInDetails,
          rate,
        };

        console.log(JSON.stringify(input, null, 4));

        const { data, errors } = (await api.CreateTimeRecord({ input })) || {};
        const { createTimeRecord } = data || {};
        if (errors || !createTimeRecord) {
          console.warn(errors);
          if (!createTimeRecord) {
            const errorMessage = `Clock-in failed: ${
              !errors || !errors[0] || errors[0].message
            }`;
            throw new Error(errorMessage);
          }
        }
        return JSON.stringify(createTimeRecord);
      }
    },
    resetPassword: async (ctx) => {
      const {
        identity: { claims },
        arguments: { employeeId, temporaryPassword },
      } = ctx;

      const password = isValidPassword(temporaryPassword)
        ? temporaryPassword
        : createTemporaryPassword();

      const { data } = await api.GetEmployee(employeeId);
      if (data && data.getEmployee) {
        if (isAuthorizedToUpdateEmployee(claims, data.getEmployee)) {
          try {
            const { username, email, firstName } = data.getEmployee;
            await user.setUserPassword(username, password);
            await ses.sendPasswordRestEmail(email, password, firstName);
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        } else {
          return false;
        }
      } else {
        console.error("Could not locate employee", employeeId);
        return false;
      }
    },
    createQP: async (ctx) => {
      const {
        identity: {
          claims: { eId, cId },
        },
        arguments: {
          input: { companyId, employeeId, b64EncodedPin, ...usrInput },
        },
      } = ctx;
      if (companyId !== cId) throw new Error("Unauthorized to set pin");
      if (employeeId !== eId)
        throw new Error(
          "Setting pin for another employee is not supported at this time"
        );
      const newId = uuid.v4(); // ID for the new QuickPunch record
      // Asychronosly create the record
      const createNewPromise = (async () => {
        let ident;
        try {
          ident = await createIdent(b64EncodedPin, companyId);
        } catch (e) {
          console.error(e);
          throw new Error("Internal error saving pin:");
        }
        const input = {
          ...usrInput,
          id: newId,
          companyId,
          employeeId,
          ident,
        };

        console.log(JSON.stringify(input, null, 4));
        return (await api.CreateQuickPunch({ input })) || {};
      })();

      // Asynchronosly remove any existing for the same employee
      const removePreviousPromise = (async () => {
        const { data, errors } =
          (await api.ListQuickPunchByEmployee({ employeeId, limit: 100 })) ||
          {};
        if (
          errors ||
          !(
            data &&
            data.listQuickPunchByEmployee &&
            data.listQuickPunchByEmployee.items
          )
        ) {
          console.warn(
            "ListQuickPunchByEmployee failed",
            { employeeId, limit: 100 },
            data,
            errors
          );
          return await Promise.all([]);
        } else {
          const deletPromises = data.listQuickPunchByEmployee.items.map(
            ({ id, _version, _deleted }) =>
              id === newId ||
              !!_deleted ||
              api
                .DeleteQuickPunch({ input: { id, _version } })
                .then((d) => {
                  // console.log(d);
                  return true;
                })
                .catch((e) => {
                  console.error(e);
                  return false;
                })
          );
          return await Promise.all(deletPromises);
        }
      })();

      // TODO (): Create promise to check for same nickName
      const [{ data, errors }] = await Promise.all([
        createNewPromise,
        removePreviousPromise,
      ]);

      const { createQuickPunch } = data || {};
      if (errors || !createQuickPunch) {
        console.warn(errors);
        if (!createQuickPunch) {
          const errorMessage = `Pin creation failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }
      const { ident: dontReturn, ...retVal } = createQuickPunch;
      return retVal;
    },
    clockIn: async (ctx) => {
      const {
        identity: {
          claims: { eId: employeeId, cId: companyId },
          sourceIp,
        },
        arguments: {
          input: { rate, punchCardDetails },
        },
      } = ctx;
      const timestampIn = Math.round(new Date().getTime() / 1000);
      const clockInDetails = {
        ...punchCardDetails,
        punchMethod: PunchMethod.TimeClock,
        createdBy: employeeId,
        ipAddress: sourceIp && sourceIp.length > 0 ? sourceIp[0] : undefined,
      };
      const input = {
        employeeId,
        companyId,
        timestampIn,
        clockInDetails,
        rate,
      };

      console.log(JSON.stringify(input, null, 4));

      const { data, errors } = (await api.CreateTimeRecord({ input })) || {};
      const { createTimeRecord } = data || {};
      if (errors || !createTimeRecord) {
        console.warn(errors);
        if (!createTimeRecord) {
          const errorMessage = `Clock-in failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }

      return createTimeRecord;
    },
    clockOut: async (ctx) => {
      const {
        identity: {
          claims: { eId: employeeId, cId: companyId },
          sourceIp,
        },
        arguments: {
          input: { id, punchCardDetails, _version },
        },
      } = ctx;
      const timestampOut = Math.round(new Date().getTime() / 1000);
      const clockOutDetails = {
        ...punchCardDetails,
        punchMethod: PunchMethod.TimeClock,
        createdBy: employeeId,
        ipAddress: sourceIp && sourceIp.length > 0 ? sourceIp[0] : undefined,
      };
      const input = {
        id,
        timestampOut,
        clockOutDetails,
        _version,
      };
      const condition = { companyId: { eq: companyId } };
      console.log(JSON.stringify({ input, condition }, null, 4));

      const { data, errors } =
        (await api.UpdateTimeRecord({ input, condition })) || {};
      const { updateTimeRecord } = data || {};
      if (errors || !updateTimeRecord) {
        console.warn(errors);
        if (!updateTimeRecord) {
          const errorMessage = `Clock-out failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }

      return updateTimeRecord;
    },
    createTimeRec: async (ctx) => {
      const {
        identity: { claims, sourceIp },
        arguments: { input: userInput },
      } = ctx;

      const { eId, cId } = claims;
      const {
        timestampIn,
        timestampOut,
        clockInDetails: clockInDetailsUsrInput,
        clockOutDetails: clockOutDetailsUsrInput,
      } = userInput;

      if (timestampOut && timestampOut <= timestampIn)
        throw new Error("Time in is not before time out:");

      const ipAddress =
        sourceIp && sourceIp.length > 0 ? sourceIp[0] : undefined;
      const clockInDetails = {
        ...(clockInDetailsUsrInput || {}),
        punchMethod: PunchMethod.Manual,
        createdBy: eId,
        ipAddress,
      };
      const clockOutDetails = {
        ...(clockOutDetailsUsrInput || {}),
        punchMethod: PunchMethod.Manual,
        createdBy: eId,
        ipAddress,
      };

      const input = {
        ...userInput,
        companyId: cId,
        clockInDetails,
        clockOutDetails,
      };
      console.log(JSON.stringify(input, null, 4));

      const { data, errors } = (await api.CreateTimeRecord({ input })) || {};
      const { createTimeRecord } = data || {};
      if (errors || !createTimeRecord) {
        console.warn(errors);
        if (!createTimeRecord) {
          const errorMessage = `CreateTimeRecord failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }

      return createTimeRecord;
    },
    updateTimeRec: async (ctx) => {
      const {
        identity: { claims, sourceIp },
        arguments: { input: userInput },
      } = ctx;

      const { eId, cId } = claims;
      const {
        timestampIn,
        timestampOut,
        clockInDetails: clockInDetailsUsrInput,
        clockOutDetails: clockOutDetailsUsrInput,
      } = userInput;

      if (timestampOut && timestampOut <= timestampIn)
        throw new Error("Time in is not before time out:");

      const ipAddress =
        sourceIp && sourceIp.length > 0 ? sourceIp[0] : undefined;
      const clockInDetails = {
        ...(clockInDetailsUsrInput || {}),
        punchMethod: PunchMethod.Manual,
        createdBy: eId,
        ipAddress,
      };
      const clockOutDetails = {
        ...(clockOutDetailsUsrInput || {}),
        punchMethod: PunchMethod.Manual,
        createdBy: eId,
        ipAddress,
      };

      const input = {
        ...userInput,
        companyId: cId,
        clockInDetails,
        clockOutDetails,
      };
      console.log(JSON.stringify(input, null, 4));

      const { data, errors } = (await api.UpdateTimeRecord({ input })) || {};
      const { updateTimeRecord } = data || {};
      if (errors || !updateTimeRecord) {
        console.warn(errors);
        if (!updateTimeRecord) {
          const errorMessage = `UpdateTimeRecord failed: ${
            !errors || !errors[0] || errors[0].message
          }`;
          throw new Error(errorMessage);
        }
      }

      return updateTimeRecord;
    },
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
          managers: [eId],
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

      const employeeInput = {
        ...input,
        id: eId,
        // username, set later
        email,
        companyId: cId,
        primaryManagerId,
        roles,
        managers: [primaryManagerId],
        allowRead: [`${ACCOUNTANT_ROLE}-${cId}`],
        allowFull: [`${OWNER_ROLE}-${cId}`, `${ADMIN_ROLE}-${cId}`],
      };

      const roleAuthorized = roles.reduce(
        (accum, role) =>
          accum &&
          isAuthorizedToUpdateRole(ctx.identity.claims, employeeInput, role),
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

      const ClientMetadata = {
        name: input.firstName,
      };

      // Attempt to create the user, the employeeId is also returned here
      // in the rare case that this is the second attempt and the user was created
      // before with a different employeeId because
      // the first attempt didn't fully complete, like if the API was down, etc.
      const username = await user
        .createUser(email, UserAttributes, ClientMetadata)
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
        input: { ...employeeInput, username },
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
      const { cId, eId } = claims;
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
        managers: curManagers,
        allowRead,
        allowFull,
        inactive,
        _deleted,
        _lastChangedAt,
        createdAt,
        updatedAt,
        primaryManagerId, // Will add back in if authorized
        managerIds, // Will add back in if authorized
        ...updateFields
      } = employeeInput;
      const isManager = curManagers.includes(eId);
      const input =
        isRoleGreater(requestorsHighestRole, MANAGER_ROLE) || isManager
          ? {
              ...updateFields,
              primaryManagerId,
              managerIds,
              // primaryManagerId is a required GraphQL field
              managers: [primaryManagerId, ...(managerIds || [])],
            }
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

      if (updateRoles && !doRoleUpdate)
        throw new Error("Unauthorized Role Update:");

      if (doRoleUpdate) input.roles = updateRoles;
      // This check confirms that the companyId and the employees roles
      // were not spoofed
      const condition = {
        and: [
          { companyId: { eq: cId } },
          ...roles.map((r) => {
            return { roles: { contains: r } };
          }),
        ],
      };
      // Make sure claim to manage the record is not spoofed
      if (isManager) {
        condition.and[condition.and.length] = { managers: { contains: eId } };
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
        try {
          const roleP = user.updateUserAttributes(username, UserAttributes);
          const singoutP = user.globalSignOut(username);
          // const [roleResp, singoutResp] =
          await Promise.all([roleP, singoutP.catch((e) => e)]);
          // console.log(JSON.stringify({ roleResp, singoutResp }, null, 4));
        } catch (e) {
          console.error(
            `Failed to update user (${username}) role to "${Value}"`,
            e
          );
          // TODO: reset the employee role back to the original
        }
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
  if (process.env.ENV !== "prod") {
    // Log every request while under development
    console.info(JSON.stringify(removeSensitive(event), null, 4));
  }
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
    console.warn(e, JSON.stringify(removeSensitive(event), null, 4));
    throw e;
  }
};
