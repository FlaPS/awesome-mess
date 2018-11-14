"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Root object of the app
 * @type {boolean | Window | NodeJS.Global | any}
 */
var root = (typeof self === 'object' && self.self === self && self)
    || (typeof global === 'object' && global.global === global && global)
    || this;
var setKey = function (key, value) {
    return root[key] = value;
};
exports.setKey = setKey;
var getKey = function (key) {
    return root[key];
};
exports.getKey = getKey;
var getStore = function () { return getKey('redux'); };
exports.getStore = getStore;
var setStore = function (store) {
    return setKey('redux', store);
};
exports.setStore = setStore;
