"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var valueTypes_1 = require("../schemes/valueTypes");
var properties_1 = require("../schemes/properties");
exports.REPORT_TYPE = {
    name: 'reportType',
    actionPrefix: 'REPORT_TYPE',
    uniqueProperty: 'reportTypeId',
    ownerKey: 'reportType',
    aclKey: 'reportType',
    lang: {
        singular: 'тип рапорта',
        plural: 'типов рапортов',
        some: 'типа рапортов',
        name: 'типы рапортов',
        gender: 'm',
    },
    properties: {
        name: properties_1.name,
        jobTypeId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'JOB_TYPE',
        }),
        color: properties_1.color,
    },
};
