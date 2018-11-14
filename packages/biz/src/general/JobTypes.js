"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var properties_1 = require("../schemes/properties");
exports.JOB_TYPE = {
    name: 'jobType',
    actionPrefix: 'JOB_TYPE',
    uniqueProperty: 'jobTypeId',
    ownerKey: 'job',
    aclKey: 'job',
    lang: {
        singular: 'тип мероприятия',
        plural: 'типов мероприятий',
        some: 'типа мероприятий',
        name: 'типы мероприятий',
        gender: 'm',
    },
    properties: {
        name: properties_1.name,
    },
};
