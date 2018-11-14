"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var schemes_1 = require("./schemes/schemes");
var utils_1 = require("@local/utils");
var root_1 = require("@local/root");
var ramda_1 = require("ramda");
exports.getSchemeByName = function (upperCase) {
    return schemes_1.default[upperCase];
};
var bizSelector = function (state) {
    return state.biz;
};
var getState = function () {
    return root_1.getStore().getState();
};
exports.sel = function (schemeOrName) {
    var scheme = typeof schemeOrName === 'string'
        ? exports.getSchemeByName(schemeOrName)
        : schemeOrName;
    return {
        propOf: function (property) {
            return function (item) {
                return function (state) {
                    if (state === void 0) {
                        state = getState();
                    }
                    var prop = scheme.properties[property];
                    var resultScheme = prop.schemeName;
                    var obj = typeof item === 'string'
                        ? exports.sel(scheme).byId(item)(state)
                        : item;
                    if (prop.type === 'itemOf' || prop.type === 'arrayOf')
                        return exports.sel(resultScheme).byId(obj[property])(state);
                    return obj[property];
                };
            };
        },
        asList: function (predicate) {
            return function (state) {
                if (state === void 0) {
                    state = getState();
                }
                return predicate
                    ? utils_1.toIndexedArray(state.biz[scheme.ownerKey]).filter(predicate)
                    : utils_1.toIndexedArray(state.biz[scheme.ownerKey]);
            };
        },
        asMap: function (predicate) {
            return function (state) {
                if (state === void 0) {
                    state = getState();
                }
                return predicate
                    ? utils_1.filterObj(predicate)(state.biz[scheme.ownerKey])
                    : state.biz[scheme.ownerKey];
            };
        },
        asIds: function (predicate) {
            return function (state) {
                if (state === void 0) {
                    state = getState();
                }
                return Object.keys(predicate
                    ? utils_1.filterObj(predicate)(state.biz[scheme.ownerKey])
                    : state.biz[scheme.ownerKey]);
            };
        },
        byId: (function (id) {
            if (id === void 0) {
                id = [];
            }
            return function (state) {
                if (state === void 0) {
                    state = getState();
                }
                return typeof id === 'string'
                    ? state.biz[scheme.ownerKey][id] || {}
                    : ramda_1.pick(id, state.biz[scheme.ownerKey]);
            };
        }),
        bySpec: function (idOrSpec) {
            return function (state) {
                if (state === void 0) {
                    state = getState();
                }
                return state.biz[scheme.ownerKey][idOrSpec] || {};
            };
        },
        getFullName: function (itemOrId) {
            var item = typeof itemOrId === 'string'
                ? exports.sel(scheme).byId(itemOrId)()
                : itemOrId;
            return scheme.getFullName
                ? scheme.getFullName(item)
                : (item['name'] || JSON.stringify(item));
        },
        getShortName: function (itemOrId) {
            var item = (typeof itemOrId === 'string'
                ? exports.sel(scheme).byId(itemOrId)()
                : itemOrId);
            return scheme.getShortName
                ? scheme.getShortName(item)
                : (item['name'] || JSON.stringify(item));
        },
    };
};
