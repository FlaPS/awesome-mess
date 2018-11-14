"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var valueTypes_1 = require("../schemes/valueTypes");
var props = require("../schemes/properties");
var selectors_1 = require("../selectors");
exports.USER_GROUP = {
    name: 'userGroup',
    actionPrefix: 'USER_GROUP',
    ownerKey: 'userGroups',
    uniqueProperty: 'userGroupId',
    aclKey: 'userGroup',
    lang: {
        singular: 'группа пользователей',
        some: 'группы пользователей',
        plural: 'групп пользователей',
        name: 'группы пользователи',
        gender: 'f',
    },
    properties: {
        wellIds: valueTypes_1.default.arrayOf({
            schemeName: 'WELL',
        }),
        wellProjectIds: valueTypes_1.default.arrayOf({
            schemeName: 'WELL_PROJECT',
        }),
        name: props.name,
        creationDate: props.creationDate,
        creatorUserId: props.creatorUserId,
        comment: props.comment,
    },
    selectors: {
        byWell: function (wellId) {
            return function (state) {
                return selectors_1.sel(exports.USER_GROUP).asMap(function (group) {
                    return (group.wellIds || []).includes(wellId);
                })(state);
            };
        },
        byProject: function (projectId) {
            return function (state) {
                return selectors_1.sel(exports.USER_GROUP).asMap(function (group) {
                    return (group.wellProjectIds || []).includes(projectId);
                })(state);
            };
        },
    }
};
