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
var BizAction_1 = require("./BizAction");
exports.defaultRig = {
    wellId: '',
    job: {},
};
var createNewRig = function (wellId) {
    return (__assign({}, exports.defaultRig, {wellId: wellId}));
};
exports.reducer = function (state, action) {
    try {
        var scheme = BizAction_1.getSchemeByAction(action);
        if (scheme && scheme.name === 'WELL')
            if (action.type.endsWith(BizAction_1.CREATED_POSTFIX))
                return __assign({}, state, (_a = {}, _a[action.payload.id] = createNewRig(action.payload.id), _a));
    }
    catch (e) {
        console.log('Error', action);
    }
    return state;
    var _a;
};
