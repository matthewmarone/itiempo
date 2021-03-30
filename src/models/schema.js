export const schema = {
    "models": {
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
                "employeeId": {
                    "name": "employeeId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "companyId": {
                    "name": "companyId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
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
                "clockInDetails": {
                    "name": "clockInDetails",
                    "isArray": false,
                    "type": {
                        "nonModel": "PunchCardDetails"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "clockOutDetails": {
                    "name": "clockOutDetails",
                    "isArray": false,
                    "type": {
                        "nonModel": "PunchCardDetails"
                    },
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
                },
                "approved": {
                    "name": "approved",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "approvedBy": {
                    "name": "approvedBy",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "TimeRecords",
            "attributes": [
                {
                    "type": "model",
                    "properties": {
                        "subscriptions": {
                            "level": "off"
                        }
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
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "provider": "iam",
                                "operations": [
                                    "create",
                                    "update",
                                    "read",
                                    "delete"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ForbiddenGroup"
                                ],
                                "operations": [
                                    "create",
                                    "update",
                                    "delete"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "employeeId",
                                "allow": "owner",
                                "identityClaim": "eId",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
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
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "phone_2": {
                    "name": "phone_2",
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
                    "isArrayNullable": false
                },
                "companyId": {
                    "name": "companyId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "primaryManagerId": {
                    "name": "primaryManagerId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "managerIds": {
                    "name": "managerIds",
                    "isArray": true,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "inactive": {
                    "name": "inactive",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "managers": {
                    "name": "managers",
                    "isArray": true,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": false
                },
                "allowRead": {
                    "name": "allowRead",
                    "isArray": true,
                    "type": "String",
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": false
                },
                "allowFull": {
                    "name": "allowFull",
                    "isArray": true,
                    "type": "String",
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": false
                }
            },
            "syncable": true,
            "pluralName": "Employees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {
                        "subscriptions": {
                            "level": "off"
                        }
                    }
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
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ForbiddenGroup"
                                ],
                                "operations": [
                                    "create",
                                    "update",
                                    "delete"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "id",
                                "allow": "owner",
                                "identityClaim": "eId",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "primaryManagerId",
                                "allow": "owner",
                                "identityClaim": "eId",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "eId",
                                "provider": "userPools",
                                "allow": "groups",
                                "groupsField": "managerIds",
                                "operations": [
                                    "read"
                                ],
                                "groupField": "groups"
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groupsField": "allowRead",
                                "operations": [
                                    "read"
                                ],
                                "groupField": "groups"
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groupsField": "allowFull",
                                "operations": [
                                    "read"
                                ],
                                "groupField": "groups"
                            }
                        ]
                    }
                }
            ]
        },
        "QuickPunch": {
            "name": "QuickPunch",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "companyId": {
                    "name": "companyId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "employeeId": {
                    "name": "employeeId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "nickName": {
                    "name": "nickName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "ident": {
                    "name": "ident",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "QuickPunches",
            "attributes": [
                {
                    "type": "model",
                    "properties": {
                        "subscriptions": {
                            "level": "off"
                        }
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmployee",
                        "fields": [
                            "employeeId"
                        ],
                        "queryField": "listQuickPunchByEmployee"
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
                                    "read",
                                    "delete"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "employeeId",
                                "allow": "owner",
                                "identityClaim": "eId",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ForbiddenGroup"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Verse": {
            "name": "Verse",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "monthYear": {
                    "name": "monthYear",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "lang": {
                    "name": "lang",
                    "isArray": false,
                    "type": {
                        "enum": "Lang"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "book": {
                    "name": "book",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "chapter": {
                    "name": "chapter",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "verseStart": {
                    "name": "verseStart",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "verseEnd": {
                    "name": "verseEnd",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "translation": {
                    "name": "translation",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "text": {
                    "name": "text",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Verses",
            "attributes": [
                {
                    "type": "model",
                    "properties": {
                        "subscriptions": {
                            "level": "off"
                        }
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byMonthYear",
                        "fields": [
                            "monthYear"
                        ],
                        "queryField": "listVerseByMonthYear"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "provider": "iam",
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
                    "properties": {
                        "subscriptions": {
                            "level": "off"
                        }
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
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ForbiddenGroup"
                                ],
                                "operations": [
                                    "create",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "PunchMethod": {
            "name": "PunchMethod",
            "values": [
                "TimeClock",
                "Manual"
            ]
        },
        "Role": {
            "name": "Role",
            "values": [
                "Owner",
                "Admin",
                "Manager",
                "Employee"
            ]
        },
        "Lang": {
            "name": "Lang",
            "values": [
                "en",
                "es"
            ]
        }
    },
    "nonModels": {
        "ModelTimeRecConnection": {
            "name": "ModelTimeRecConnection",
            "fields": {
                "items": {
                    "name": "items",
                    "isArray": true,
                    "type": {
                        "model": "TimeRecord"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "nextToken": {
                    "name": "nextToken",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "startedAt": {
                    "name": "startedAt",
                    "isArray": false,
                    "type": "AWSTimestamp",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "PunchCardDetails": {
            "name": "PunchCardDetails",
            "fields": {
                "punchMethod": {
                    "name": "punchMethod",
                    "isArray": false,
                    "type": {
                        "enum": "PunchMethod"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "photo": {
                    "name": "photo",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "note": {
                    "name": "note",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "ipAddress": {
                    "name": "ipAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
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
    "version": "eddf1276058db4fd2f7e44af6e61f423"
};