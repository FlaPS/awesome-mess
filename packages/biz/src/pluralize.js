"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var EntityScheme_1 = require("./schemes/EntityScheme");
var getCount = function (quant) {
    return typeof quant === 'number'
        ? quant
        : (quant.length
            ? quant.length
            : Object.keys(quant).length);
};
var getString = function (scheme, quant) {
    var quantity = getCount(quant);
    var lang = scheme.lang || EntityScheme_1.defaultLang;
    if ((quantity % 100 <= 20 && quantity % 100 >= 11)
        || (quantity % 10 >= 5 && quantity % 10 <= 9)
        || (quantity % 10 === 0))
        return lang.plural;
    if (quantity % 10 === 1)
        return lang.singular;
    if (quantity === 0)
        return lang.plural;
    return lang.some;
};
exports.default = function (scheme, prependQuant) {
    if (prependQuant === void 0) {
        prependQuant = true;
    }
    return function (quant) {
        if (quant === void 0) {
            quant = 0;
        }
        return prependQuant
            ? quant + ' ' + getString(scheme, quant)
            : getString(scheme, quant);
    };
};
