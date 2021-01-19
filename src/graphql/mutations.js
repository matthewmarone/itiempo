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
export const createTimeRecord = /* GraphQL */ `
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
export const updateTimeRecord = /* GraphQL */ `
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
export const deleteTimeRecord = /* GraphQL */ `
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
