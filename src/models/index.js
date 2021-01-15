// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Role = {
  "OWNER": "Owner",
  "ADMIN": "Admin",
  "MANAGER": "Manager",
  "EMPLOYEE": "Employee"
};

const { Employee, Company, TimeRecord, PayRate } = initSchema(schema);

export {
  Employee,
  Company,
  TimeRecord,
  Role,
  PayRate
};