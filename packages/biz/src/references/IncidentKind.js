"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ReferenceScheme_1 = require("./ReferenceScheme");
var IncidentType_1 = require("./IncidentType");
var valueTypes_1 = require("../valueTypes");
var IncidentKindLang = {
    singular: 'подвид ',
    plural: 'подвидов ',
    some: 'подвида ',
    name: 'подвиды ',
    gender: 'm',
};
exports.INCIDENT_KIND = ReferenceScheme_1.createNestedReferenceScheme('INCIDENT_KIND', IncidentKindLang, IncidentType_1.INCIDENT_TYPE.uniqueProperty, {
    parentId: valueTypes_1.default.string({
        required: true,
    }),
});
