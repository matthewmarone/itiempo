// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PunchMethod = {
  "TIME_CLOCK": "TimeClock",
  "MANUAL": "Manual"
};

const Role = {
  "OWNER": "Owner",
  "ADMIN": "Admin",
  "MANAGER": "Manager",
  "EMPLOYEE": "Employee"
};

const { TimeRecord, Employee, QuickPunch, Company, ModelTimeRecConnection, PunchCardDetails, PayRate, QuickClockInConnection, QuickDirectory } = initSchema(schema);

export {
  TimeRecord,
  Employee,
  QuickPunch,
  Company,
  PunchMethod,
  Role,
  ModelTimeRecConnection,
  PunchCardDetails,
  PayRate,
  QuickClockInConnection,
  QuickDirectory
};