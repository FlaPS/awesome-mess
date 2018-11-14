"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
if (!Array.prototype['flatMap']) {
    Object.defineProperty(Array.prototype, 'flatMap', {
        value: function (f) {
            var _this = this;
            return this.reduce(function (ys, x) {
                return ys.concat(f.call(_this, x));
            }, []);
        },
        enumerable: false,
    });
}

function sortBy(f) {
    for (var i = this.length; i;) {
        var o = this[--i];
        this[i] = [].concat(f.call(o, o, i), o);
    }
    this.sort(function (a, b) {
        for (var i = 0, len = a.length; i < len; ++i) {
            if (a[i] != b[i])
                return a[i] < b[i] ? -1 : 1;
        }
        return 0;
    });
    for (var i = this.length; i;) {
        this[--i] = this[i][this[i].length - 1];
    }
    return this;
}

exports.sortBy = sortBy;
exports.toAssociativeArray = function (property) {
    if (property === void 0) {
        property = 'id';
    }
    return function (array) {
        var result = {};
        for (var i = 0; i < array.length; i++)
            result[array[i][property].toString()] = array[i];
        return result;
    };
};
exports.toIndexedArray = function (array, withKey) {
    var result = [];
    var index = 0;
    for (var i in array) {
        result[index] = array[i];
        if (withKey)
            result[index][withKey] = i;
        index++;
    }
    return result;
};
exports.orderBy = function (propertyName) {
    return function (a, b) {
        return a[propertyName] > b[propertyName]
            ? 1
            : -1;
    };
};
exports.arrify = function (val) {
    if (val === null || val === undefined)
        return [];
    return Array.isArray(val) ? val : [val];
};
exports.isArray = Array.isArray;
