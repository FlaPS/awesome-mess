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
var monocle_ts_1 = require("monocle-ts");
var ramda_1 = require("ramda");
var BizAction_1 = require("./BizAction");
var index_1 = require("./schemes/index");
var fsa_1 = require("@local/fsa");
var index_2 = require("./index");
var Rig_1 = require("./Rig");
exports.bizReducer = function (state, action) {
    if (state === void 0) {
        state = index_2.defaultBizState;
    }
    var newRigs = Rig_1.reducer(state.rigs, action);
    if (newRigs !== state.rigs)
        state = __assign({}, state, {rigs: newRigs});
    if (fsa_1.isType(BizAction_1.actions.reset)(action))
        return action.payload.biz;
    else if (fsa_1.isType(BizAction_1.actions.clearState)(action))
        return index_2.defaultBizState;
    else if (fsa_1.isType(BizAction_1.actions.setStateGUID)(action)) {
        return __assign({}, state, {meta: __assign({}, state.meta, {stateGUID: action.payload})});
    }
    else if (action.type.startsWith(BizAction_1.BIZ_PREFIX)) {
        var schemeName = action.type.split('/')[1];
        var scheme = index_1.schemes[schemeName];
        if (action.payload && scheme) {
            var itemLens_1;
            var schemeLens_1 = monocle_ts_1.Lens.fromProp(scheme.ownerKey);
            var mutate = function (id) {
                itemLens_1 = monocle_ts_1.Lens.fromProp(id);
                state = schemeLens_1
                    .compose(itemLens_1)
                    .modify(function (obj) {
                        return ramda_1.merge(obj, action.payload.patch);
                    })(state);
            };
            if (action.type.includes(BizAction_1.POPULATED_POSTFIX))
                action.payload.id.forEach(mutate);
            else
                mutate(action.payload.id);
            if (action.guid && action.masterEventId)
                state = __assign({}, state, {
                    meta: __assign({}, state.meta, {
                        lastMasterEventGuid: action.guid,
                        lastMasterEventId: action.masterEventId
                    })
                });
            return state;
        }
    }
    return state;
};
var createRig = {};
