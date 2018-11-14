"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var utils_1 = require("@local/utils");
var meta = function (type) {
    return function (meta) {
        return utils_1.cast(Object.assign({}, meta, {type: type}));
    };
};
exports.default = {
    text: meta('text'),
    string: meta('string'),
    boolean: meta('boolean'),
    number: meta('number'),
    int: meta('int'),
    uint: meta('uint'),
    array: meta('array'),
    arrayOf: meta('arrayOf'),
    itemOf: meta('itemOf'),
    datetime: meta('datetime'),
    timestamp: meta('timestamp'),
    daterange: meta('daterange'),
};
