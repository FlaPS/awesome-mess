"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ramda_1 = require("ramda");
var valueTypes_1 = require("../schemes/valueTypes");
var properties_1 = require("../schemes/properties");
var selectors_1 = require("../selectors");
var index_1 = require("../../../utils/src/index");
var UserGroup_1 = require("./UserGroup");
var User_1 = require("./User");
var WellProject_1 = require("./WellProject");
var allWells = function () {
    return selectors_1.sel('WELL').asMap();
};
var inProjectAndUserGroup = function (wellProjectId, userGroupId) {
    return function (state) {
        var userGroup = selectors_1.sel(UserGroup_1.USER_GROUP).byId(userGroupId)(state);
        var excludedInProject = userGroup.excludedWellsInProjects[wellProjectId] || [];
        return ramda_1.compose(index_1.filterObj(function (well) {
            return well.wellProjectId === wellProjectId &&
                !excludedInProject.includes(well.wellId);
        }), allWells())(state);
    };
};
exports.WELL = {
    name: 'well',
    actionPrefix: 'WELL',
    uniqueProperty: 'wellId',
    ownerKey: 'wells',
    aclKey: 'wells',
    lang: {
        singular: 'скважина',
        plural: 'скважин',
        some: 'скважины',
        name: 'скважины',
    },
    getFullName: function (_a) {
        var wellPlaceId = _a.wellPlaceId, wellFieldId = _a.wellFieldId, clusterNumber = _a.clusterNumber,
            number = _a.number;
        var wellField = selectors_1.sel('WELL_FIELD').byId(wellFieldId)().name;
        var wellPlace = selectors_1.sel('WELL_PLACE').byId(wellPlaceId)().name;
        return (wellField || 'NN') + " \u043C-\u0435, " + (wellPlace || 'NN') + " \u043F\u043B., \u043A." + (clusterNumber || 'NN') + ", " + (number || 'NN');
    },
    getShortName: function (_a) {
        var wellPlaceId = _a.wellPlaceId, wellFieldId = _a.wellFieldId, clusterNumber = _a.clusterNumber,
            number = _a.number;
        var wellField = selectors_1.sel('WELL_FIELD').byId(wellFieldId)().name;
        var wellPlace = selectors_1.sel('WELL_PLACE').byId(wellPlaceId)().name;
        return (wellField || 'NN') + " \u043C-\u0435, " + (wellPlace || 'NN') + " \u043F\u043B., \u043A." + (clusterNumber || 'NN') + ", " + (number || 'NN');
    },
    properties: {
        wellFieldId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'WELL_FIELD',
        }),
        wellProjectId: valueTypes_1.default.itemOf({
            type: 'string',
            schemeName: 'WELL_PROJECT',
        }),
        wellPurposeId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'WELL_PURPOSE',
        }),
        wellStatusId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'WELL_STATUS',
        }),
        wellLicenseAreaId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'WELL_LICENSE_AREA',
        }),
        wellPlaceId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'WELL_PLACE',
        }),
        startDate: valueTypes_1.default.datetime(),
        clusterNumber: valueTypes_1.default.string(),
        basing: valueTypes_1.default.number({
            required: true,
        }),
        number: valueTypes_1.default.string({
            required: true,
        }),
        altitude: valueTypes_1.default.number(),
        creationDate: properties_1.creationDate,
        creatorUserId: properties_1.creatorUserId,
        comment: properties_1.comment,
    },
    selectors: {
        inGroup: function (userGroupId) {
            return (function (state) {
                var wells = allWells()(state);
                var ids = selectors_1.sel(UserGroup_1.USER_GROUP).byId(userGroupId)(state).wellIds;
                return ramda_1.pick(ids, wells);
            });
        },
        inProject: function (wellProjectId) {
            return function (state) {
                var wells = allWells()(state);
                var filtered = index_1.filterObj(ramda_1.whereEq({wellProjectId: wellProjectId}))(wells);
                return filtered;
            };
        },
        availableForUser: function (userId) {
            return function (state) {
                var user = selectors_1.sel(User_1.USER).byId(userId)(state);
                var group = selectors_1.sel(UserGroup_1.USER_GROUP).byId(user.userGroupId)(state);
                if (!group)
                    return [];
                var projects = WellProject_1.WELL_PROJECT.selectors.byGroup(user.userGroupId)(state);
                return ramda_1.flatten(projects.map(function (p) {
                    return inProjectAndUserGroup(p.wellProjectId, user.userGroupId)(state);
                }));
            };
        },
        inProjectAndUserGroup: inProjectAndUserGroup,
    },
};
