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
var effects_1 = require("redux-saga/effects");
var redux_1 = require("redux");
var redux_saga_1 = require("redux-saga");
var redux_saga_2 = require("redux-saga");
var argv = require('yargs')
    .default('data', 'slave1')
    .default('--development', false)
    .argv;
var file_data_1 = require("@local/file-data");
var distDirectory = file_data_1.default.getDistPath();
var launch_1 = require("./launch");
var logger_1 = require("@local/logger");
var actions_1 = require("./actions");
var fsa_1 = require("@local/fsa");
var config_1 = require("./config");
var shortid = require('shortid');
var actorPath = __filename;
var logger = logger_1.getLogger('ACTOR_SYSTEM');

/**
 * Send action to parent actor, make one available to take
 * @param action
 */
function out(action) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                return [4 /*yield*/, effects_1.put(actions_1.default.output(action, {}))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}

exports.out = out;
var inputTaker = function (actorId) {
    return function (pattern) {
        return function (action) {
            if (action.meta && actorId == action.meta.actorId && fsa_1.isType(actions_1.default.input)(action)) {
                var input = action.payload;
                if (typeof pattern === 'string' && input.type == pattern)
                    return true;
                if (typeof pattern === 'function' && pattern(input))
                    return true;
            }
            return false;
        };
    };
};

function runInMemoryActor(actorBody, forked, actorId, isTopLevel) {
    if (forked === void 0) {
        forked = false;
    }
    if (actorId === void 0) {
        actorId = shortid.generate();
    }
    if (isTopLevel === void 0) {
        isTopLevel = false;
    }
    return __awaiter(this, void 0, void 0, function () {
        var fullActorPath, sagaMiddleware, result, store, isActor, channel, reader, readerTask, take, run, kill;
        return __generator(this, function (_a) {
            logger.log('actor body is', typeof actorBody, actorBody);
            if (typeof actorBody === 'string') {
                fullActorPath = actorBody;
                logger.log('launch actor from here', fullActorPath);
                actorBody = require(fullActorPath).default;
            }
            sagaMiddleware = redux_saga_1.default();
            result = actorBody;
            if (typeof actorBody === 'function')
                result = actorBody();
            store = typeof result['throw'] == 'function' ?
                redux_1.createStore(function (state) {
                    return state;
                }, {}, redux_1.compose(redux_1.applyMiddleware(sagaMiddleware)))
                :
                result;
            isActor = function (action) {
                return action.meta.actorId == actorId;
            };
            if (!store.runSaga)
                store.runSaga = sagaMiddleware.run;
            if (store != result)
                store.runSaga(actorBody);
            channel = redux_saga_2.eventChannel(function (emit) {
                var task = store.runSaga(function emitter() {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                return [4 /*yield*/, effects_1.takeEvery(fsa_1.isType(actions_1.default.output), function (action) {
                                    return __generator(this, function (_a) {
                                        action.meta.actorId = actorId;
                                        if (forked) {
                                            process.send(action);
                                        }
                                        else {
                                            emit(action);
                                        }
                                        return [2 /*return*/];
                                    });
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
                return function () {
                    task.cancel();
                    if (readerTask) {
                        readerTask.cancel();
                        readerTask = undefined;
                    }
                };
            });
            reader = function reader() {
                var action;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!true) return [3 /*break*/, 3];
                            return [4 /*yield*/, effects_1.take(channel)];
                        case 1:
                            action = _a.sent();
                            action.type = actions_1.default.input.type;
                            return [4 /*yield*/, effects_1.put(actions_1.default.input(action.payload, {actorId: actorId}))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 0];
                        case 3:
                            return [2 /*return*/];
                    }
                });
            };
            take = function (pattern) {
                var action;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/, effects_1.take(inputTaker(actorId)(pattern))];
                        case 1:
                            action = _a.sent();
                            return [2 /*return*/, action.payload];
                    }
                });
            };
            if (forked) {
                process.on('message', store.dispatch);
            }
            run = function () {
                return effects_1.fork(reader);
            };
            kill = function () {
                if (forked)
                    process.exit(0);
                else
                    channel.close();
            };
            return [2 /*return*/, {
                put: store.dispatch,
                isActor: isActor,
                actorId: actorId,
                channel: channel,
                readerTask: readerTask,
                take: take,
                run: run,
                kill: kill
            }];
        });
    });
}

exports.runInMemoryActor = runInMemoryActor;

function runIPCActor(actorBody, forwardDebugger, actorId) {
    if (forwardDebugger === void 0) {
        forwardDebugger = false;
    }
    if (actorId === void 0) {
        actorId = shortid.generate();
    }
    return __awaiter(this, void 0, void 0, function () {
        var child, channelEmit, channel, reader, readerTask, take, isActor, putToChild, run, kill, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    return [4 /*yield*/, launch_1.default(actorPath, forwardDebugger, (_a = {}, _a['--actor'] = actorBody, _a['--actorId'] = actorId, _a))];
                case 1:
                    child = _b.sent();
                    return [4 /*yield*/, childInitialize(child)];
                case 2:
                    _b.sent();
                    channel = redux_saga_2.eventChannel(function (emit) {
                        channelEmit = function (action) {
                            emit(actions_1.default.output(action, {actorId: actorId}));
                        };
                        child
                            .on('message', function (message) {
                                logger.log('emit to channel from forked child', message);
                                emit(message);
                            })
                            .on('disconnect', function () {
                                return channelEmit(actions_1.default.disconnected());
                            })
                            .on('exit', function () {
                                return channelEmit(actions_1.default.disconnected());
                            })
                            .on('error', function () {
                                channelEmit(actions_1.default.disconnected());
                            })
                            .on('close', function () {
                                channelEmit(actions_1.default.disconnected());
                            });
                        return function () {
                            if (child.connected)
                                child.kill();
                            child.removeAllListeners();
                            if (readerTask) {
                                readerTask.cancel();
                                readerTask = undefined;
                            }
                        };
                    });
                    reader = function reader() {
                        var action;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!true) return [3 /*break*/, 3];
                                    return [4 /*yield*/, effects_1.take(channel)];
                                case 1:
                                    action = _a.sent();
                                    action.type = actions_1.default.input.type;
                                    return [4 /*yield*/, effects_1.put(action)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 3:
                                    return [2 /*return*/];
                            }
                        });
                    };
                    take = function (pattern) {
                        var action;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    return [4 /*yield*/, effects_1.fork(reader)];
                                case 1:
                                    readerTask = _a.sent();
                                    return [4 /*yield*/, effects_1.take(inputTaker(actorId)(pattern))];
                                case 2:
                                    action = _a.sent();
                                    return [4 /*yield*/, effects_1.cancel(readerTask)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/, action.payload];
                            }
                        });
                    };
                    isActor = function (action) {
                        return action.meta.actorId == actorId;
                    };
                    putToChild = function (action) {
                        if (child.connected)
                            child.send(action);
                        else {
                            logger.log('child disconnected');
                            channelEmit(actions_1.default.disconnected());
                        }
                    };
                    run = function () {
                        return effects_1.fork(reader);
                    };
                    kill = function () {
                        return child.kill();
                    };
                    return [2 /*return*/, {
                        put: putToChild,
                        isActor: isActor,
                        actorId: actorId, channel: channel,
                        run: run,
                        take: take,
                        kill: kill
                    }];
            }
        });
    });
}

exports.runIPCActor = runIPCActor;
var childInitialize = function (child) {
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                return child.once('message', resolve);
            })];
        });
    });
};

function runActor(actorBody, forwardDebugger, inMemory, actorId) {
    if (forwardDebugger === void 0) {
        forwardDebugger = undefined;
    }
    if (inMemory === void 0) {
        inMemory = undefined;
    }
    if (actorId === void 0) {
        actorId = shortid.generate();
    }
    return __awaiter(this, void 0, void 0, function () {
        var cfg, actorData, cfg, actorData;
        return __generator(this, function (_a) {
            if (typeof inMemory === 'undefined') {
                cfg = config_1.actorSystemConfig.getData();
                actorData = cfg.actors.filter(function (act) {
                    return act.path == actorBody;
                });
                inMemory = actorData.length ? actorData[0].inMemory : true;
            }
            if (typeof forwardDebugger === 'undefined') {
                cfg = config_1.actorSystemConfig.getData();
                actorData = cfg.actors.filter(function (act) {
                    return act.path == actorBody;
                });
                forwardDebugger = actorData.length ? actorData[0].forwardDebugger : false;
            }
            //logger.log('LAUNCH ACTOR', actorBody, 'inMemory=', inMemory, 'forward debugger=', forwardDebugger)
            return [2 /*return*/, inMemory ?
                runInMemoryActor(actorBody, false, actorId)
                :
                runIPCActor(actorBody, forwardDebugger, actorId)];
        });
    });
}

exports.runActor = runActor;
/**
 * Self in memory run
 * @returns {Promise<void>}
 */
exports.startTopProcessActor = function (actorBody, forked, actorId, isTopLevel) {
    if (forked === void 0) {
        forked = false;
    }
    if (actorId === void 0) {
        actorId = 'rootActor';
    }
    if (isTopLevel === void 0) {
        isTopLevel = false;
    }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, runInMemoryActor(actorBody, forked, actorId, isTopLevel)];
        });
    });
};
if (argv.actor) {
    exports.startTopProcessActor(argv.actor, true, argv.actorId, false);
    if (process.send)
        process.send(actions_1.default.initialized());
}
