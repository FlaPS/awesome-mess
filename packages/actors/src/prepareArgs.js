"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = {
        label: 0, sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
        }, trys: [], ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;

    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {value: op[1], done: false};
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {value: op[0] ? op[1] : void 0, done: true};
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", {value: true});
var free_port_1 = require("@local/free-port");
/**
 * Copy all execArgs of parent process, and launch child with same with replace debug port
 * @param process
 * @param forwardDebugger
 * @returns {Promise<{args: string[], execArgv: string[]}>}
 */
exports.default = function (process, forwardDebugger, argsExtra) {
    if (forwardDebugger === void 0) {
        forwardDebugger = true;
    }
    if (argsExtra === void 0) {
        argsExtra = {};
    }
    return __awaiter(_this, void 0, void 0, function () {
        var args, execArgv, i, _a, option, value, _b, _c, _d, k, k;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    args = process.argv.slice(2);
                    execArgv = process.execArgv.concat();
                    for (i = 0; i < execArgv.length; i++) {
                        _a = execArgv[i].split('='), option = _a[0], value = _a[1];
                        if (option === '--inspect-brk') {
                            execArgv.splice(i, 1);
                            i--;
                        }
                    }
                    if (!forwardDebugger) return [3 /*break*/, 2];
                    _c = (_b = execArgv).push;
                    _d = '--inspect-brk=';
                    return [4 /*yield*/, free_port_1.default(Number(25000))];
                case 1:
                    _c.apply(_b, [_d + (_e.sent())]);
                    _e.label = 2;
                case 2:
                    for (k in argsExtra)
                        if (args.indexOf(k) !== -1)
                            args.splice(args.indexOf(k), 2);
                    for (k in argsExtra)
                        args.push(k, argsExtra[k]);
                    console.log('ARGS ', args, execArgv);
                    return [2 /*return*/, {args: args, execArgv: execArgv}];
            }
        });
    });
};
