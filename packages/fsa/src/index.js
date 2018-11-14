"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var factoryDelimeter = ':';
exports.reducerFactory = function (reducer) {
    return function (selector) {
        return function (state, action) {
            return selector(action) ? reducer(state, action) : state;
        };
    };
};
exports.isType = function (actionCreator) {
    return function (action) {
        return action.type === actionCreator.type;
    };
};
exports.isTypeOfAny = function (actionCreator) {
    return function (action) {
        return actionCreator.some(function (creator) {
            return creator.type === action.type;
        });
    };
};
exports.isNamespace = function (actionFactory) {
    return function (action) {
        return action.type.includes(actionFactory.base);
    };
};

function actionCreatorFactory(prefix, defaultIsError) {
    if (defaultIsError === void 0) {
        defaultIsError = function (p) {
            return p instanceof Error;
        };
    }
    var actionTypes = {};
    var base = prefix ? "" + prefix + factoryDelimeter : '';

    function actionCreator(type, commonMeta, isError) {
        if (isError === void 0) {
            isError = defaultIsError;
        }
        var fullType = base + type;
        if (process.env.NODE_ENV !== 'production') {
            if (actionTypes[fullType])
                throw new Error("Duplicate action types   : " + fullType);
            actionTypes[fullType] = true;
        }
        var creator = Object.assign(function (payload, meta) {
            var action = {
                type: fullType,
                payload: payload,
            };
            if (commonMeta || meta) {
                action.meta = Object.assign({}, commonMeta, meta);
            }
            if (isError && (typeof isError === 'boolean' || isError(payload))) {
                action.error = true;
            }
            return action;
        }, {
            reduce: function (f) {
                return f;
            },
            type: fullType,
            base: base,
        });
        var reduce = function (reducer) {
            return exports.reducerFactory(reducer)(exports.isType(creator));
        };
        var handler = function (payload) {
            return ({});
        };
        var result = Object.assign(creator, {example: creator(undefined)}, {reduce: reduce, handler: handler});
        return result;
    }

    function asyncActionCreators(type, commonMeta) {
        return {
            type: base + type,
            started: actionCreator(type + "_STARTED", commonMeta, false),
            done: actionCreator(type + "_DONE", commonMeta, false),
            failed: actionCreator(type + "_FAILED", commonMeta, true),
        };
    }

    return Object.assign(actionCreator, {async: asyncActionCreators, base: base});
}

exports.actionCreatorFactory = actionCreatorFactory;

function reducerWithInitialState(initialValue) {
    return makeReducer([], initialValue);
}

exports.reducerWithInitialState = reducerWithInitialState;

function reducerWithoutInitialState() {
    return makeReducer([]);
}

exports.reducerWithoutInitialState = reducerWithoutInitialState;

function upcastingReducer() {
    return makeReducer([]);
}

exports.upcastingReducer = upcastingReducer;

function makeReducer(cases, initialValue) {
    var reducer = (function (state, action) {
        if (state === void 0) {
            state = initialValue;
        }
        for (var i = 0, length_1 = cases.length; i < length_1; i++) {
            var _a = cases[i], actionCreator = _a.actionCreator, handler = _a.handler;
            if (exports.isType(actionCreator)(action)) {
                return handler(state, action.payload);
            }
        }
        return state;
    });
    reducer.case = function (actionCreator, handler) {
        return makeReducer(cases.concat([{actionCreator: actionCreator, handler: handler}]), initialValue);
    };
    return reducer;
}
