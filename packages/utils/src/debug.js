"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = function (f, interrup) {
    if (interrup === void 0) {
        interrup = true;
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (interrup)
            debugger;
        return f.apply(void 0, args);
    };
};
