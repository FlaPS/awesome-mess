"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// tslint:disable-next-line:variable-name
var __production = true;
exports.setProduction = function (value) {
    return __production = value;
};
exports.isProduction = function () {
    return __production;
};
var isNodeEnvironment = typeof process === 'object' &&
    process + '' === '[object process]';
var isBackend = function () {
    return isNodeEnvironment;
};
exports.isBackend = isBackend;
var isFrontend = function () {
    return !isNodeEnvironment;
};
exports.isFrontend = isFrontend;
