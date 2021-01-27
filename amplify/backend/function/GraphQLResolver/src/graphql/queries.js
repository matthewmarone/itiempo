/* eslint-disable */

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

exports.getEmployee = getEmployee;
exports.getCompany = getCompany;
