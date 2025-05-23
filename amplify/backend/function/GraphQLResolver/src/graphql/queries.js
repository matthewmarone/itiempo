/* eslint-disable */

const listQuickPunchByEmployee = /* GraphQL */ `
  query ListQuickPunchByEmployee(
    $employeeId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelQuickPunchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuickPunchByEmployee(
      employeeId: $employeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        companyId
        employeeId
        nickName
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        ident
      }
      nextToken
      startedAt
    }
  }
`;
const listQuickPunchByCompany = /* GraphQL */ `
  query ListQuickPunchByCompany(
    $companyId: ID
    $nickName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuickPunchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuickPunchByCompany(
      companyId: $companyId
      nickName: $nickName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        companyId
        employeeId
        nickName
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
const getQuickPunch = /* GraphQL */ `
  query GetQuickPunch($id: ID!) {
    getQuickPunch(id: $id) {
      id
      companyId
      employeeId
      nickName
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      ident
    }
  }
`;
const getCompany = /* GraphQL */ `
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
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
const getEmployee = /* GraphQL */ `
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
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
      department
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
      inactive
      managers
      allowRead
      allowFull
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
const listEmployeesByEmail = /* GraphQL */ `
  query ListEmployeesByEmail(
    $companyId: ID
    $email: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployeesByEmail(
      companyId: $companyId
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        department
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
        inactive
        managers
        allowRead
        allowFull
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
const getTimeRecord = /* GraphQL */ `
  query GetTimeRecord($id: ID!) {
    getTimeRecord(id: $id) {
      id
      employeeId
      companyId
      timestampIn
      timestampOut
      clockInDetails {
        punchMethod
        createdBy
        photo
        note
        ipAddress
        coordsLong
        coordsLat
        coordsAccuracy
        coordsErrorCode
      }
      clockOutDetails {
        punchMethod
        createdBy
        photo
        note
        ipAddress
        coordsLong
        coordsLat
        coordsAccuracy
        coordsErrorCode
      }
      rate {
        name
        amount
        isHourly
        isDefault
      }
      approved
      approvedBy
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
const listEmployeeTimeRecords = /* GraphQL */ `
  query ListEmployeeTimeRecords(
    $employeeId: ID
    $timestampIn: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTimeRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployeeTimeRecords(
      employeeId: $employeeId
      timestampIn: $timestampIn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        companyId
        timestampIn
        timestampOut
        clockInDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
          coordsLong
          coordsLat
          coordsAccuracy
          coordsErrorCode
        }
        clockOutDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
          coordsLong
          coordsLat
          coordsAccuracy
          coordsErrorCode
        }
        rate {
          name
          amount
          isHourly
          isDefault
        }
        approved
        approvedBy
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
const listCompanyTimeRecords = /* GraphQL */ `
  query ListCompanyTimeRecords(
    $companyId: ID
    $timestampIn: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTimeRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanyTimeRecords(
      companyId: $companyId
      timestampIn: $timestampIn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        employeeId
        companyId
        timestampIn
        timestampOut
        clockInDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
          coordsLong
          coordsLat
          coordsAccuracy
          coordsErrorCode
        }
        clockOutDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
          coordsLong
          coordsLat
          coordsAccuracy
          coordsErrorCode
        }
        rate {
          name
          amount
          isHourly
          isDefault
        }
        approved
        approvedBy
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;

exports.listCompanyTimeRecords = listCompanyTimeRecords;
exports.listEmployeeTimeRecords = listEmployeeTimeRecords;
exports.getTimeRecord = getTimeRecord;
exports.getEmployee = getEmployee;
exports.listEmployeesByEmail = listEmployeesByEmail;
exports.getCompany = getCompany;
exports.listQuickPunchByEmployee = listQuickPunchByEmployee;
exports.getQuickPunch = getQuickPunch;
exports.listQuickPunchByCompany = listQuickPunchByCompany;
