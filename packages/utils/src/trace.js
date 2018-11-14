"use strict";
/**
 * Tap function to test incoming arguments and the result of a function call
 *
 * <example>
 *     const fnc = (a, b) => a + b
 *     const tracedSum = trace('sum call', 'log')
 *     tracedSum(fnc)(2, 3)
 *     // console outputs :  sum call, fnc,
 *     // ARGS: 2, 3
 *     // RESULT: 5
 *
 * </example>
 */
Object.defineProperty(exports, "__esModule", {value: true});
exports.trace = function (message, traceLevel) {
    if (message === void 0) {
        message = 'trace call';
    }
    if (traceLevel === void 0) {
        traceLevel = 'log';
    }
    return function (f) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = f.apply(void 0, args);
            console[traceLevel].apply(console, [message, f.name, '\nARGS:'].concat(args, ['\nRESULT:', result]));
            return result;
        };
    };
};
