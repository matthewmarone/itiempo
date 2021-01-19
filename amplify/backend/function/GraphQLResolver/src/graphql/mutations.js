/* eslint-disable */
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
      roles
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
      roles
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
      roles
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
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
        roles
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
          roles
          companyId
          primaryManagerId
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          allowFull
        }
        allowFull
        timeRecords {
          nextToken
          startedAt
        }
      }
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
