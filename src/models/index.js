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

const { TimeRecord, QuickPunch, Employee, Company, ModelTimeRecConnection, PunchCardDetails, PayRate, QuickClockInConnection } = initSchema(schema);

export {
  TimeRecord,
  QuickPunch,
  Employee,
  Company,
  PunchMethod,
  Role,
  ModelTimeRecConnection,
  PunchCardDetails,
  PayRate,
  QuickClockInConnection
};