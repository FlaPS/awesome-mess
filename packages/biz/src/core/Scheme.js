"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var monocle_ts_1 = require("monocle-ts");
var ramda_1 = require("ramda");
var schemes_1 = require("./schemes");
exports.defaultLang = {
    singular: 'объект',
    some: 'объекта',
    plural: 'объектов',
    name: 'объекты',
    gender: 'n',
};
exports.schemeLens = function (scheme) {
    return monocle_ts_1.Lens.fromProp('biz')
        .compose(monocle_ts_1.Lens.fromProp(typeof scheme === 'string' ?
            schemes_1.default[scheme].ownerKey :
            scheme.ownerKey));
};
exports.keyLens = function (key) {
    return monocle_ts_1.Lens.fromProp(key);
};
var isSearchableProperty = function (p) {
    return p.type === 'string' || p.type === 'text' || p.type === 'datetime';
};
exports.getSearchableProps = function (scheme) {
    return Object.keys(ramda_1.filter(isSearchableProperty, scheme.properties));
};
exports.UNKNOWN = {
    properties: {},
    lang: {},
};
