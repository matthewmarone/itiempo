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
export const listQuickPunchByCompany = /* GraphQL */ `
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
        ident
      }
      nextToken
      startedAt
    }
  }
`;
export const listQuickPunchByEmployee = /* GraphQL */ `
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
export const syncQuickPunches = /* GraphQL */ `
  query SyncQuickPunches(
    $filter: ModelQuickPunchFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncQuickPunches(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
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
export const getQuickPunch = /* GraphQL */ `
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
export const listQuickPunchs = /* GraphQL */ `
  query ListQuickPunchs(
    $filter: ModelQuickPunchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuickPunchs(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      }
      nextToken
      startedAt
    }
  }
`;
export const listEmployeesByEmail = /* GraphQL */ `
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
export const listEmployeeTimeRecords = /* GraphQL */ `
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
export const listCompanyTimeRecords = /* GraphQL */ `
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
