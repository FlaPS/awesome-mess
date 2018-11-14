"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var createScheme_1 = require("../createScheme");
var properties_1 = require("../schemes/properties");
exports.ROLE = createScheme_1.createScheme({
    name: 'role',
    actionPrefix: 'ROLE',
    uniqueProperty: 'roleId',
    ownerKey: 'roles',
    aclKey: 'roles',
    lang: {
        singular: 'роль',
        some: 'роли',
        plural: 'ролей',
        name: 'роли',
        gender: 'f',
    },
    properties: {
        name: properties_1.name,
        creationDate: properties_1.creationDate,
        creatorUserId: properties_1.creatorUserId,
        color: properties_1.color,
        comment: properties_1.comment,
    },
});
