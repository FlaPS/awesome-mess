"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var valueTypes_1 = require("../schemes/valueTypes");
var properties_1 = require("../schemes/properties");
exports.JOB = {
    name: 'job',
    actionPrefix: 'JOB',
    uniqueProperty: 'jobId',
    ownerKey: 'job',
    aclKey: 'job',
    lang: {
        singular: 'мероприятие',
        plural: 'мероприятий',
        some: 'мероприятия',
        name: 'мероприятия',
    },
    properties: {
        wellId: valueTypes_1.default.itemOf({
            schemeName: 'WELL',
            required: true,
        }),
        reportFormIds: valueTypes_1.default.arrayOf({
            schemeName: 'REPORT_FORM',
        }),
        jobTypeId: valueTypes_1.default.itemOf({
            schemeName: 'JOB_TYPE',
            required: true,
        }),
        drillRigId: valueTypes_1.default.itemOf({
            schemeName: 'DRILL_RIG',
        }),
        contractors: valueTypes_1.default.array({
            langRU: 'подрядчики',
        }),
        planDateTimeRange: valueTypes_1.default.daterange({
            required: true,
            langRU: 'плановые даты',
        }),
        factDateTimeRange: valueTypes_1.default.daterange({
            langRU: 'фактические даты',
        }),
        creationDate: properties_1.creationDate,
        creatorUserId: properties_1.creatorUserId,
    },
};
