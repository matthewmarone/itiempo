/* eslint-disable */

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

exports.getEmployee = getEmployee;
