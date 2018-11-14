"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ReferenceScheme_1 = require("./ReferenceScheme");
var wellStatusLang = {
    singular: 'статус',
    some: 'статуса',
    plural: 'статусов',
    name: 'статусы',
    gender: 'm',
};
exports.WELL_STATUS = ReferenceScheme_1.createReferenceScheme('WELL_STATUS', wellStatusLang);
