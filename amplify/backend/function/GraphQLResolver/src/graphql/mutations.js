const deleteCompany = /* GraphQL */ `
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
const deleteEmployee = /* GraphQL */ `
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
      companyId
      primaryManagerId
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      roles
      allowFull
    }
  }
`;
const updateCompany = /* GraphQL */ `
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
const createCompany = /* GraphQL */ `
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
const updateEmployee = /* GraphQL */ `
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
      companyId
      primaryManagerId
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      roles
      allowFull
    }
  }
`;
const createEmployee = /* GraphQL */ `
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
      companyId
      primaryManagerId
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      roles
      allowFull
    }
  }
`;
const createTimeRecord = /* GraphQL */ `
  mutation CreateTimeRecord(
    $input: CreateTimeRecordInput!
    $condition: ModelTimeRecordConditionInput
  ) {
    createTimeRecord(input: $input, condition: $condition) {
      id
      companyId
      employeeId
      primaryManagerId
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
const updateTimeRecord = /* GraphQL */ `
  mutation UpdateTimeRecord(
    $input: UpdateTimeRecordInput!
    $condition: ModelTimeRecordConditionInput
  ) {
    updateTimeRecord(input: $input, condition: $condition) {
      id
      companyId
      employeeId
      primaryManagerId
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
const deleteTimeRecord = /* GraphQL */ `
  mutation DeleteTimeRecord(
    $input: DeleteTimeRecordInput!
    $condition: ModelTimeRecordConditionInput
  ) {
    deleteTimeRecord(input: $input, condition: $condition) {
      id
      companyId
      employeeId
      primaryManagerId
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

exports.createCompany = createCompany;
exports.updateCompany = updateCompany;
exports.deleteCompany = deleteCompany;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
exports.createTimeRecord = createTimeRecord;
exports.updateTimeRecord = updateTimeRecord;
exports.deleteTimeRecord = deleteTimeRecord;
