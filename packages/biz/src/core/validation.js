"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ramda_1 = require("ramda");
var root_1 = require("@local/root");
var isErrorGenerator = function (value, item) {
    return value instanceof Function;
};
var runRule = function (_a) {
    var predicate = _a[0], error = _a[1];
    return function (value, item) {
        return predicate(value, item) || error;
    };
};
var runRules = ramda_1.map(runRule);
var spected = function (spec) {
    return function (input) {
        var result = {};
        Object.keys(spec).map(function (key) {
            var rules = spec[key];
            var subResult = [];
            if (rules && rules[0]) {
                if (rules[0][0] === exports.isRequired) {
                    if (!input[key])
                        subResult.push(rules[0][1]);
                    else
                        subResult = rules.map(function (r) {
                            return runRule(r)(input[key], input);
                        }).filter(function (v) {
                            return v !== true;
                        });
                }
                else if (input[key] !== undefined)
                    subResult = rules.map(function (r) {
                        return runRule(r)(input[key], input);
                    }).filter(function (v) {
                        return v !== true;
                    });
            }
            if (subResult.length)
                result[key] = subResult;
        });
        return result;
    };
};
exports.createSpec = function (scheme, onlyProps) {
    if (!onlyProps) {
        onlyProps = Object.keys(scheme.properties);
    }
    var spec = {};
    onlyProps.forEach(function (property) {
        if (scheme.properties[property]) {
            spec[property] = [];
            if (scheme.properties[property].required) {
                spec[property].push([exports.isRequired, 'Требутеся указать']);
            }
            if (scheme.properties[property].unique) {
                spec[property].push([exports.isUnique(scheme, property), 'Должно быть уникальным']);
            }
            if (scheme.properties[property].rules) {
                spec[property] = spec[property].concat(scheme.properties[property].rules);
            }
        }
    });
    return spected(spec);
};
exports.hasCapitalLetter = function (a) {
    return /[A-Z]/.test(a);
};
exports.isGreaterThan = function (len) {
    return function (a) {
        return (a > len);
    };
};
exports.isSmallerThan = function (len) {
    return function (a) {
        return (a < len);
    };
};
exports.isLengthGreaterThan = function (len) {
    return ramda_1.compose(exports.isGreaterThan(len), ramda_1.prop('length'));
};
exports.isLengthSmallerThan = function (len) {
    return ramda_1.compose(exports.isSmallerThan(len), ramda_1.prop('length'));
};
exports.notEmpty = ramda_1.allPass([ramda_1.compose(ramda_1.not, ramda_1.isEmpty), ramda_1.compose(ramda_1.not, ramda_1.isNil), exports.isLengthGreaterThan(0)]);
exports.isRequired = function (value) {
    return Boolean(value);
};
var selectors_1 = require("../sel");
exports.isUnique = function (scheme, property) {
    return function (value, item, state) {
        if (state === void 0) {
            state = root_1.getStore().getState();
        }
        var list = selectors_1.sel(scheme).asList()()
            .filter(function (o) {
                return o[scheme.uniqueProperty] !== item[scheme.uniqueProperty];
            });
        var result = list
            .map(function (o) {
                return o[property];
            })
            .includes(item[property]);
        return !result;
    };
};
exports.default = spected;
