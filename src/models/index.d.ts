import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum PunchMethod {
  TIME_CLOCK = "TimeClock",
  MANUAL = "Manual"
}

export enum Role {
  OWNER = "Owner",
  ADMIN = "Admin",
  MANAGER = "Manager",
  EMPLOYEE = "Employee"
}

export declare class ModelTimeRecConnection {
  readonly items?: (TimeRecord | null)[];
  readonly nextToken?: string;
  readonly startedAt?: number;
  constructor(init: ModelInit<ModelTimeRecConnection>);
}

export declare class PunchCardDetails {
  readonly punchMethod: PunchMethod | keyof typeof PunchMethod;
  readonly createdBy: string;
  readonly photo?: string;
  readonly note?: string;
  readonly ipAddress?: string;
  constructor(init: ModelInit<PunchCardDetails>);
}

export declare class PayRate {
  readonly name?: string;
  readonly amount: number;
  readonly isHourly: boolean;
  readonly isDefault: boolean;
  constructor(init: ModelInit<PayRate>);
}

export declare class QuickClockInConnection {
  readonly items?: (QuickDirectory | null)[];
  readonly nextToken?: string;
  readonly startedAt?: number;
  constructor(init: ModelInit<QuickClockInConnection>);
}

export declare class QuickDirectory {
  readonly id: string;
  readonly companyId: string;
  readonly employeeId: string;
  readonly nickName: string;
  constructor(init: ModelInit<QuickDirectory>);
}

export declare class TimeRecord {
  readonly id: string;
  readonly employeeId: string;
  readonly companyId: string;
  readonly timestampIn: number;
  readonly timestampOut?: number;
  readonly clockInDetails: PunchCardDetails;
  readonly clockOutDetails?: PunchCardDetails;
  readonly rate?: PayRate;
  readonly approved?: boolean;
  readonly approvedBy?: string;
  constructor(init: ModelInit<TimeRecord>);
  static copyOf(source: TimeRecord, mutator: (draft: MutableModel<TimeRecord>) => MutableModel<TimeRecord> | void): TimeRecord;
}

export declare class Employee {
  readonly id: string;
  readonly username: string;
  readonly profilePhoto?: string;
  readonly email: string;
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
  readonly roles: Role[] | keyof typeof Role;
  readonly companyId: string;
  readonly primaryManagerId: string;
  readonly managerIds?: string[];
  readonly inactive?: boolean;
  readonly managers: string[];
  readonly allowRead: string[];
  readonly allowFull: string[];
  constructor(init: ModelInit<Employee>);
  static copyOf(source: Employee, mutator: (draft: MutableModel<Employee>) => MutableModel<Employee> | void): Employee;
}

export declare class QuickPunch {
  readonly id: string;
  readonly companyId: string;
  readonly employeeId: string;
  readonly nickName: string;
  readonly ident: string;
  constructor(init: ModelInit<QuickPunch>);
  static copyOf(source: QuickPunch, mutator: (draft: MutableModel<QuickPunch>) => MutableModel<QuickPunch> | void): QuickPunch;
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