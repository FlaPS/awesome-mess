"use strict";
var __assign = (this && this.__assign) || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", {value: true});
var EntityScheme_1 = require("../EntityScheme");
var createScheme_1 = require("../../createScheme");
var properties_1 = require("../properties");
var properties = require("../properties");
exports.createReferenceScheme = function (name, lang, additionalProperties, isNested) {
    if (lang === void 0) {
        lang = EntityScheme_1.defaultLang;
    }
    if (additionalProperties === void 0) {
        additionalProperties = {};
    }
    if (isNested === void 0) {
        isNested = false;
    }
    var parts = name.split('_').map(function (s, i) {
        return i === 0
            ? s.toLocaleLowerCase()
            : s.charAt(0) + s.slice(1).toLocaleLowerCase();
    });
    var camelCase = parts.join('');
    return createScheme_1.createScheme({
        isReference: true,
        isNested: isNested,
        name: camelCase,
        typeUID: '0',
        actionPrefix: name,
        ownerKey: camelCase,
        uniqueProperty: camelCase + 'Id',
        aclKey: camelCase,
        lang: lang,
        properties: Object.assign({
            name: properties.name,
            creationDate: properties_1.creationDate,
            creatorUserId: properties_1.creatorUserId,
        }, additionalProperties),
    });
};
exports.createNestedReferenceScheme = function (name, lang, parentUniqueProperty, additionalProperties) {
    if (lang === void 0) {
        lang = EntityScheme_1.defaultLang;
    }
    if (additionalProperties === void 0) {
        additionalProperties = {};
    }
    return (__assign({}, exports.createReferenceScheme(name, lang, additionalProperties, true), {parentUniqueProperty: parentUniqueProperty}));
};
