/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        employees {
          nextToken
          startedAt
        }
        timeRecords {
          nextToken
          startedAt
        }
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
      employees {
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
        nextToken
        startedAt
      }
      timeRecords {
        items {
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
        employees {
          nextToken
          startedAt
        }
        timeRecords {
          nextToken
          startedAt
        }
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
        companyId
        primaryManagerId
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        company {
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
        primaryManager {
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
        roles
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
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
        companyId
        primaryManagerId
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        company {
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
        primaryManager {
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
        roles
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
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
      companyId
      primaryManagerId
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      company {
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
        employees {
          nextToken
          startedAt
        }
        timeRecords {
          nextToken
          startedAt
        }
      }
      primaryManager {
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
        company {
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
        primaryManager {
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
        roles
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
      roles
      allowFull
      timeRecords {
        items {
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
        companyId
        primaryManagerId
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        company {
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
        primaryManager {
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
        roles
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
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
      company {
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
        employees {
          nextToken
          startedAt
        }
        timeRecords {
          nextToken
          startedAt
        }
      }
      employee {
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
        company {
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
        primaryManager {
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
        roles
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
      primaryManage {
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
        company {
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
        primaryManager {
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
        roles
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
        company {
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
        employee {
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
        primaryManage {
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
        company {
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
        employee {
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
        primaryManage {
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
        company {
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
        employee {
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
        primaryManage {
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
        company {
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
        employee {
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
        primaryManage {
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
      nextToken
      startedAt
    }
  }
`;
