/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const setupNewAccount = /* GraphQL */ `
  mutation SetupNewAccount {
    setupNewAccount {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateUserRole = /* GraphQL */ `
  mutation UpdateUserRole(
    $username: ID!
    $employeeId: ID!
    $managerIds: [String!]!
    $roles: [Role!]!
    $previousRoles: [Role!]!
    $_version: Int!
  ) {
    updateUserRole(
      username: $username
      employeeId: $employeeId
      managerIds: $managerIds
      roles: $roles
      previousRoles: $previousRoles
      _version: $_version
    ) {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateEmpl = /* GraphQL */ `
  mutation UpdateEmpl($input: emplInput!) {
    updateEmpl(input: $input) {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteEmployee = /* GraphQL */ `
  mutation DeleteEmployee(
    $input: DeleteEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    deleteEmployee(input: $input, condition: $condition) {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createCompany = /* GraphQL */ `
  mutation CreateCompany(
    $input: CreateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    createCompany(input: $input, condition: $condition) {
      id
      name
      website
      addressLine1
      addressLine2
      city
      state
      zip
      country
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      allowUpdate
    }
  }
`;
export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany(
    $input: UpdateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    updateCompany(input: $input, condition: $condition) {
      id
      name
      website
      addressLine1
      addressLine2
      city
      state
      zip
      country
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      allowUpdate
    }
  }
`;
export const deleteCompany = /* GraphQL */ `
  mutation DeleteCompany(
    $input: DeleteCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    deleteCompany(input: $input, condition: $condition) {
      id
      name
      website
      addressLine1
      addressLine2
      city
      state
      zip
      country
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      allowUpdate
    }
  }
`;
export const createEmployee = /* GraphQL */ `
  mutation CreateEmployee(
    $input: CreateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    createEmployee(input: $input, condition: $condition) {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateEmployee = /* GraphQL */ `
  mutation UpdateEmployee(
    $input: UpdateEmployeeInput!
    $condition: ModelEmployeeConditionInput
  ) {
    updateEmployee(input: $input, condition: $condition) {
      id
      username
      profilePhoto
      email
      email_2
      firstName
      lastName
      phone
      phone_2
      addressLine1
      addressLine2
      city
      state
      zip
      country
      jobTitle
      payRates {
        name
        amount
        isHourly
        isDefault
      }
      roles
      companyId
      primaryManagerId
      managerIds
      allowRead
      allowFull
      inactive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createTimeRecord = /* GraphQL */ `
  mutation CreateTimeRecord(
    $input: CreateTimeRecordInput!
    $condition: ModelTimeRecordConditionInput
  ) {
    createTimeRecord(input: $input, condition: $condition) {
      id
      employeeId
      companyId
      primaryManagerId
      managerIds
      timestampIn
      timestampOut
      photoIn
      photoOut
      noteIn
      noteOut
      rate {
        name
        amount
        isHourly
        isDefault
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateTimeRecord = /* GraphQL */ `
  mutation UpdateTimeRecord(
    $input: UpdateTimeRecordInput!
    $condition: ModelTimeRecordConditionInput
  ) {
    updateTimeRecord(input: $input, condition: $condition) {
      id
      employeeId
      companyId
      primaryManagerId
      managerIds
      timestampIn
      timestampOut
      photoIn
      photoOut
      noteIn
      noteOut
      rate {
        name
        amount
        isHourly
        isDefault
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteTimeRecord = /* GraphQL */ `
  mutation DeleteTimeRecord(
    $input: DeleteTimeRecordInput!
    $condition: ModelTimeRecordConditionInput
  ) {
    deleteTimeRecord(input: $input, condition: $condition) {
      id
      employeeId
      companyId
      primaryManagerId
      managerIds
      timestampIn
      timestampOut
      photoIn
      photoOut
      noteIn
      noteOut
      rate {
        name
        amount
        isHourly
        isDefault
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
