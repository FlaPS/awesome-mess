"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var valueTypes_1 = require("../schemes/valueTypes");
var createScheme_1 = require("../createScheme");
var props = require("../schemes/properties");
exports.DRILL_RIG = createScheme_1.createScheme({
    name: 'drillRig',
    actionPrefix: 'DRILL_RIG',
    uniqueProperty: 'drillRigId',
    aclKey: 'drillRig',
    ownerKey: 'drillRigs',
    lang: {
        singular: 'буровая установка',
        some: 'буровой установки',
        plural: 'буровых установок',
        name: 'буровые установки',
        gender: 'f',
    },
    properties: {
        serialNumber: valueTypes_1.default.string({
            required: true,
        }),
        manufacturer: valueTypes_1.default.string({
            required: true,
        }),
        productionYear: valueTypes_1.default.string({
            required: true,
        }),
        ownerId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'DRILL_RIG_OWNER',
        }),
        typeId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'DRILL_RIG_TYPE',
        }),
        rigWinchTypeId: valueTypes_1.default.itemOf({
            schemeName: 'RIG_WINCH_TYPE',
        }),
        drillingCementComplex: valueTypes_1.default.string(),
        name: props.name,
        creationDate: props.creationDate,
        creatorUserId: props.creatorUserId,
    },
});
