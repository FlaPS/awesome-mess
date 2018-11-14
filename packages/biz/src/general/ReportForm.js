"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var valueTypes_1 = require("../schemes/valueTypes");
var properties_1 = require("../schemes/properties");
exports.REPORT_FORM = {
    name: 'reportForm',
    actionPrefix: 'REPORT_FORM',
    uniqueProperty: 'reportFormId',
    ownerKey: 'reportForm',
    aclKey: 'reportForm',
    lang: {
        singular: 'форма рапорта',
        plural: 'форм рапортов',
        some: 'формы рапортов',
        name: 'формы рапортов',
        gender: 'f',
    },
    properties: {
        name: properties_1.name,
        reportTypeId: valueTypes_1.default.itemOf({
            required: true,
            schemeName: 'REPORT_TYPE',
        }),
    },
};
