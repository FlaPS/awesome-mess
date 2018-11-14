"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.estimate = function (test, label) {
    if (label === void 0) {
        label = 'someFunction';
    }
    console.time('estimate ' + label);
    var result = test();
    console.timeEnd('estimate ' + label);
    return result;
};
