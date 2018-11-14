"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var validation_1 = require("../schemes/validation");
var valueTypes_1 = require("../schemes/valueTypes");
var ramda_1 = require("ramda");
var createScheme_1 = require("../createScheme");
var R = require("ramda");
var WellProject_1 = require("./WellProject");
var UserGroup_1 = require("./UserGroup");
var props = require("../schemes/properties");
var selectors_1 = require("../selectors");
exports.USER = createScheme_1.createScheme({
    spec: {
        userId: 'string',
    },
    name: 'user',
    actionPrefix: 'USER',
    uniqueProperty: 'userId',
    ownerKey: 'users',
    aclKey: 'user',
    lang: {
        singular: 'пользователь',
        some: 'пользователя',
        plural: 'пользователей',
        name: 'пользователи',
        gender: 'm',
    },
    getShortName: function (user) {
        return user.lastName + " " + doInitial(user.firstName) + " " + doInitial(user.patrName);
    },
    getFullName: function (user) {
        return user.lastName + ' ' +
            user.firstName + ' ' +
            user.patrName + ' ';
    },
    properties: {
        login: valueTypes_1.default.string({
            required: true,
            unique: true,
            rules: [],
        }),
        password: valueTypes_1.default.string({
            required: true,
            rules: [
                [validation_1.isLengthGreaterThan(4), 'Пароль должен включать не менее 4-x символов'],
            ],
        }),
        lastName: valueTypes_1.default.string({
            required: true,
        }),
        firstName: valueTypes_1.default.string({
            required: true,
        }),
        patrName: valueTypes_1.default.string(),
        email: valueTypes_1.default.string({
            required: true,
        }),
        userGroupId: valueTypes_1.default.itemOf({
            type: 'string',
            schemeName: 'USER_GROUP',
        }),
        roleIds: valueTypes_1.default.arrayOf({
            schemeName: 'ROLE',
        }),
        organization: valueTypes_1.default.string(),
        position: valueTypes_1.default.string(),
        phone: valueTypes_1.default.string(),
        creationDate: props.creationDate,
        creatorUserId: props.creatorUserId,
    },
    selectors: {
        byGroupId: function (userGroupId) {
            return selectors_1.sel(exports.USER).asMap(function (u) {
                return u.userGroupId === userGroupId;
            });
        },
        byWellId: function (wellId) {
            return function (state) {
                var relatedProjects = selectors_1.sel(WellProject_1.WELL_PROJECT)
                    .asIds(function (p) {
                        return (p.wellIds || []).includes(wellId);
                    })(state);
                var relatedGroups = selectors_1.sel(UserGroup_1.USER_GROUP).asIds(function (g) {
                    return (g.wellIds || []).includes(wellId) ||
                        R.intersection(g.wellProjectsIds || [], relatedProjects || []).length > 0;
                })(state);
                return selectors_1.sel(exports.USER).asMap(function (u) {
                    return relatedGroups.includes(u.userGroupId);
                })(state);
            };
        },
    }
});
var doInitial = ramda_1.compose(function (x) {
    return x + ".";
}, ramda_1.toUpper, ramda_1.head);
