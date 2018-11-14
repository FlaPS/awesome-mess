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
exports.default = function (pred) {
    return function (array) {
        return Object
            .keys(array)
            .reduce(function (r, key) {
                return pred(array[key])
                    ? __assign({}, r, (_a = {}, _a[key] = array[key], _a)) : r;
                var _a;
            }, {});
    };
};
