"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var properties_1 = require("../schemes/properties");
var selectors_1 = require("../selectors");
var User_1 = require("./User");
var UserGroup_1 = require("./UserGroup");
var byGroup = function (groupId) {
    return selectors_1.sel(UserGroup_1.USER_GROUP).propOf('wellProjectIds')(groupId);
};
exports.WELL_PROJECT = {
    name: 'wellProject',
    actionPrefix: 'WELL_PROJECT',
    uniqueProperty: 'wellProjectId',
    ownerKey: 'wellProject',
    aclKey: 'wellProject',
    lang: {
        singular: 'группа скважин',
        plural: 'групп скважин',
        some: 'группы скважин',
        name: 'группы скважин',
        gender: 'f',
    },
    properties: {
        name: properties_1.name,
        creationDate: properties_1.creationDate,
        creatorUserId: properties_1.creatorUserId,
        comment: properties_1.comment,
    },
    selectors: {
        byGroup: byGroup,
        availableForUser: function (userId) {
            return function (state) {
                var user = selectors_1.sel(User_1.USER).byId(userId)(state);
                return byGroup(user.userGroupId)(state);
            };
        },
    },
};
