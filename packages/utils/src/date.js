"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.DAY_MILIS = 24 * 60 * 60 * 1000;
exports.cloneDate = function (date) {
    return new Date(date.getTime());
};
exports.formatYYYYMMDD = function (date, delimiter) {
    if (delimiter === void 0) {
        delimiter = '-';
    }
    return date.getFullYear() +
        delimiter +
        exports.formatMM(date) +
        delimiter +
        exports.formatDD(date);
};
exports.formatMM = function (date) {
    return exports.formatTwoSignFromInt(date.getMonth() + 1);
};
exports.formatDD = function (date) {
    return exports.formatTwoSignFromInt(date.getDate());
};
exports.formatTwoSignFromInt = function (value) {
    return value >= 10 ? String(value) : '0' + value;
};
