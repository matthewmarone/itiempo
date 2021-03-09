/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const timeRecordReport = /* GraphQL */ `
  query TimeRecordReport(
    $filter: TimeRecordReportFilterInput!
    $limit: Int
    $nextToken: String
  ) {
    timeRecordReport(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        }
        clockOutDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
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
export const byIdent = /* GraphQL */ `
  query ByIdent($ident: String!, $companyId: ID!) {
    byIdent(ident: $ident, companyId: $companyId) {
      employeeId
      timeRecordId
      timestampIn
    }
  }
`;
export const syncCompanies = /* GraphQL */ `
  query SyncCompanies(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCompanies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getCompany = /* GraphQL */ `
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
export const listCompanys = /* GraphQL */ `
  query ListCompanys(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncEmployees = /* GraphQL */ `
  query SyncEmployees(
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEmployees(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
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
        ident
      }
      nextToken
      startedAt
    }
  }
`;
export const getEmployee = /* GraphQL */ `
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
      ident
    }
  }
`;
export const listEmployees = /* GraphQL */ `
  query ListEmployees(
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployees(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        ident
      }
      nextToken
      startedAt
    }
  }
`;
export const getTimeRecord = /* GraphQL */ `
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
      }
      clockOutDetails {
        punchMethod
        createdBy
        photo
        note
        ipAddress
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
export const listTimeRecords = /* GraphQL */ `
  query ListTimeRecords(
    $filter: ModelTimeRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTimeRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        }
        clockOutDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
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
export const syncTimeRecords = /* GraphQL */ `
  query SyncTimeRecords(
    $filter: ModelTimeRecordFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTimeRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
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
        }
        clockOutDetails {
          punchMethod
          createdBy
          photo
          note
          ipAddress
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
