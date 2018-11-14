"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ReferenceScheme_1 = require("./ReferenceScheme");
var valueTypes_1 = require("../valueTypes");
var wellLicenseAreaLang = {
    singular: 'лицензионный участок',
    plural: 'лицензионных участков',
    some: 'лицензионных участка',
    name: 'лицензионные участки',
    gender: 'm',
};
exports.WELL_LICENSE_AREA = ReferenceScheme_1.createReferenceScheme('WELL_LICENSE_AREA', wellLicenseAreaLang, {
    expirationDate: valueTypes_1.default.datetime(),
});
