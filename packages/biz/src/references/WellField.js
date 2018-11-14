"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ReferenceScheme_1 = require("./ReferenceScheme");
var wellFieldLang = {
    singular: 'месторождение',
    plural: 'месторождений',
    some: 'месторождения',
    name: 'месторождения',
    gender: 'n',
};
exports.WELL_FIELD = ReferenceScheme_1.createReferenceScheme('WELL_FIELD', wellFieldLang);
