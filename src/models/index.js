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

const Lang = {
  "EN": "en",
  "ES": "es"
};

const { TimeRecord, Employee, QuickPunch, Verse, Company, ModelTimeRecConnection, PunchCardDetails, PayRate } = initSchema(schema);

export {
  TimeRecord,
  Employee,
  QuickPunch,
  Verse,
  Company,
  PunchMethod,
  Role,
  Lang,
  ModelTimeRecConnection,
  PunchCardDetails,
  PayRate
};