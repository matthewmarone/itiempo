import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Role {
  OWNER = "Owner",
  ADMIN = "Admin",
  MANAGER = "Manager",
  EMPLOYEE = "Employee"
}

export declare class PayRate {
  readonly name?: string;
  readonly amount: number;
  readonly isHourly: boolean;
  readonly isDefault: boolean;
  constructor(init: ModelInit<PayRate>);
}

export declare class Employee {
  readonly id: string;
  readonly username?: string;
  readonly profilePhoto?: string;
  readonly email?: string;
  readonly email_2?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly phone_2?: string;
  readonly addressLine1?: string;
  readonly addressLine2?: string;
  readonly city?: string;
  readonly state?: string;
  readonly zip?: string;
  readonly country?: string;
  readonly jobTitle?: string;
  readonly payRates?: PayRate[];
  readonly roles?: Role[] | keyof typeof Role;
  readonly companyId?: string;
  readonly primaryManagerId?: string;
  readonly managerIds?: string[];
  readonly allowRead?: (string | null)[];
  readonly allowFull?: (string | null)[];
  constructor(init: ModelInit<Employee>);
  static copyOf(source: Employee, mutator: (draft: MutableModel<Employee>) => MutableModel<Employee> | void): Employee;
}

export declare class Company {
  readonly id: string;
  readonly name?: string;
  readonly website?: string;
  readonly addressLine1?: string;
  readonly addressLine2?: string;
  readonly city?: string;
  readonly state?: string;
  readonly zip?: string;
  readonly country?: string;
  readonly allowUpdate?: (string | null)[];
  constructor(init: ModelInit<Company>);
  static copyOf(source: Company, mutator: (draft: MutableModel<Company>) => MutableModel<Company> | void): Company;
}

export declare class TimeRecord {
  readonly id: string;
  readonly employeeId: string;
  readonly companyId: string;
  readonly primaryManagerId: string;
  readonly managerIds?: string[];
  readonly timestampIn: number;
  readonly timestampOut?: number;
  readonly photoIn?: string;
  readonly photoOut?: string;
  readonly noteIn?: string;
  readonly noteOut?: string;
  readonly rate?: PayRate;
  constructor(init: ModelInit<TimeRecord>);
  static copyOf(source: TimeRecord, mutator: (draft: MutableModel<TimeRecord>) => MutableModel<TimeRecord> | void): TimeRecord;
}