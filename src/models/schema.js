export const schema = {
    "models": {
        "Employee": {
            "name": "Employee",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "profilePhoto": {
                    "name": "profilePhoto",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "AWSEmail",
                    "isRequired": true,
                    "attributes": []
                },
                "email_2": {
                    "name": "email_2",
                    "isArray": false,
                    "type": "AWSEmail",
                    "isRequired": false,
                    "attributes": []
                },
                "firstName": {
                    "name": "firstName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lastName": {
                    "name": "lastName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phone": {
                    "name": "phone",
                    "isArray": false,
                    "type": "AWSPhone",
                    "isRequired": false,
                    "attributes": []
                },
                "phone_2": {
                    "name": "phone_2",
                    "isArray": false,
                    "type": "AWSPhone",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine1": {
                    "name": "addressLine1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine2": {
                    "name": "addressLine2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "zip": {
                    "name": "zip",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "jobTitle": {
                    "name": "jobTitle",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "payRates": {
                    "name": "payRates",
                    "isArray": true,
                    "type": {
                        "nonModel": "PayRate"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "roles": {
                    "name": "roles",
                    "isArray": true,
                    "type": {
                        "enum": "Role"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "company": {
                    "name": "company",
                    "isArray": false,
                    "type": {
                        "model": "Company"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "companyId"
                    }
                },
                "timeRecords": {
                    "name": "timeRecords",
                    "isArray": true,
                    "type": {
                        "model": "TimeRecord"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "employee"
                    }
                },
                "primaryManager": {
                    "name": "primaryManager",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "primaryManagerId"
                    }
                },
                "allowFull": {
                    "name": "allowFull",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                }
            },
            "syncable": true,
            "pluralName": "Employees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCompany",
                        "fields": [
                            "companyId",
                            "email"
                        ],
                        "queryField": "listEmployeesByEmail"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "provider": "iam",
                                "operations": [
                                    "create",
                                    "update",
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "id",
                                "allow": "owner",
                                "identityClaim": "eId",
                                "operations": [
                                    "read",
                                    "update"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "primaryManagerId",
                                "allow": "owner",
                                "identityClaim": "eId",
                                "operations": [
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groupsField": "allowFull",
                                "operations": [
                                    "update",
                                    "delete",
                                    "read"
                                ],
                                "groupField": "groups"
                            }
                        ]
                    }
                }
            ]
        },
        "Company": {
            "name": "Company",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "website": {
                    "name": "website",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine1": {
                    "name": "addressLine1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "addressLine2": {
                    "name": "addressLine2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "city": {
                    "name": "city",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "zip": {
                    "name": "zip",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "employees": {
                    "name": "employees",
                    "isArray": true,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "company"
                    }
                },
                "timeRecords": {
                    "name": "timeRecords",
                    "isArray": true,
                    "type": {
                        "model": "TimeRecord"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "company"
                    }
                },
                "allowUpdate": {
                    "name": "allowUpdate",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                }
            },
            "syncable": true,
            "pluralName": "Companies",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "provider": "iam",
                                "operations": [
                                    "create",
                                    "update",
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groupsField": "allowUpdate",
                                "operations": [
                                    "update"
                                ],
                                "groupField": "groups"
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "id",
                                "allow": "owner",
                                "identityClaim": "cId",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "TimeRecord": {
            "name": "TimeRecord",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "company": {
                    "name": "company",
                    "isArray": false,
                    "type": {
                        "model": "Company"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "companyId"
                    }
                },
                "employee": {
                    "name": "employee",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "employeeId"
                    }
                },
                "primaryManage": {
                    "name": "primaryManage",
                    "isArray": false,
                    "type": {
                        "model": "Employee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "primaryManagerId"
                    }
                },
                "timestampIn": {
                    "name": "timestampIn",
                    "isArray": false,
                    "type": "AWSTimestamp",
                    "isRequired": true,
                    "attributes": []
                },
                "timestampOut": {
                    "name": "timestampOut",
                    "isArray": false,
                    "type": "AWSTimestamp",
                    "isRequired": false,
                    "attributes": []
                },
                "photoIn": {
                    "name": "photoIn",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "photoOut": {
                    "name": "photoOut",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "noteIn": {
                    "name": "noteIn",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "noteOut": {
                    "name": "noteOut",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "rate": {
                    "name": "rate",
                    "isArray": false,
                    "type": {
                        "nonModel": "PayRate"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "TimeRecords",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCompany",
                        "fields": [
                            "companyId",
                            "employeeId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmployee",
                        "fields": [
                            "employeeId",
                            "companyId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmployeeTimestamp",
                        "fields": [
                            "employeeId",
                            "timestampIn"
                        ],
                        "queryField": "listEmployeeTimeRecords"
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCompanyTimestamp",
                        "fields": [
                            "companyId",
                            "timestampIn"
                        ],
                        "queryField": "listCompanyTimeRecords"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "provider": "iam",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            },
                            {
                                "allow": "private",
                                "provider": "userPools",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "Role": {
            "name": "Role",
            "values": [
                "Owner",
                "Admin",
                "Manager",
                "Employee"
            ]
        }
    },
    "nonModels": {
        "PayRate": {
            "name": "PayRate",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "amount": {
                    "name": "amount",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "isHourly": {
                    "name": "isHourly",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "isDefault": {
                    "name": "isDefault",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                }
            }
        }
    },
    "version": "1bf77c098280b852510923d9a88f8d88"
};