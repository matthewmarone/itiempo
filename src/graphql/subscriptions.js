/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany($id: String) {
    onCreateCompany(id: $id) {
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany($id: String) {
    onUpdateCompany(id: $id) {
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany($id: String) {
    onDeleteCompany(id: $id) {
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
export const onCreateEmployee = /* GraphQL */ `
  subscription OnCreateEmployee($id: String, $primaryManagerId: String) {
    onCreateEmployee(id: $id, primaryManagerId: $primaryManagerId) {
      id
      profilePhoto
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      username
      email
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
    }
  }
`;
export const onUpdateEmployee = /* GraphQL */ `
  subscription OnUpdateEmployee($id: String, $primaryManagerId: String) {
    onUpdateEmployee(id: $id, primaryManagerId: $primaryManagerId) {
      id
      profilePhoto
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      username
      email
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
    }
  }
`;
export const onDeleteEmployee = /* GraphQL */ `
  subscription OnDeleteEmployee($id: String, $primaryManagerId: String) {
    onDeleteEmployee(id: $id, primaryManagerId: $primaryManagerId) {
      id
      profilePhoto
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      username
      email
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
    }
  }
`;
export const onCreateTimeRecord = /* GraphQL */ `
  subscription OnCreateTimeRecord {
    onCreateTimeRecord {
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
export const onUpdateTimeRecord = /* GraphQL */ `
  subscription OnUpdateTimeRecord {
    onUpdateTimeRecord {
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
export const onDeleteTimeRecord = /* GraphQL */ `
  subscription OnDeleteTimeRecord {
    onDeleteTimeRecord {
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
