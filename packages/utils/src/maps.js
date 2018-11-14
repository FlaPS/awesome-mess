"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var PropertyMap = /** @class */ (function () {
    function PropertyMap(keyProperty, source) {
        if (keyProperty === void 0) {
            keyProperty = 'id';
        }
        if (source === void 0) {
            source = [];
        }
        var _this = this;
        this._map = new Map();
        this.remap = function (source) {
            if (source === void 0) {
                source = [];
            }
            for (var i = 0; i < source.length; i++)
                _this.set(String(source[i][_this.keyProperty]), source[i]);
        };
        this.addToMap = function (source) {
            if (source === void 0) {
                source = [];
            }
            for (var i = 0; i < source.length; i++)
                _this.set(String(source[i][_this.keyProperty]), source[i]);
        };
        this.get = function (key) {
            return _this._map.get(String(key));
        };
        this.set = function (key, value) {
            return _this._map.set(String(key), value);
        };
        this.has = function (key) {
            return _this._map.has(key);
        };
        this.clear = function () {
            return _this._map.clear();
        };
        this.delete = function (key) {
            return _this._map.delete(key);
        };
        this.keyProperty = keyProperty;
        this.remap(source);
    }

    return PropertyMap;
}());
exports.PropertyMap = PropertyMap;
var PropertyMultiMap = /** @class */ (function () {
    function PropertyMultiMap(keyProperty, source) {
        if (keyProperty === void 0) {
            keyProperty = 'type_id';
        }
        if (source === void 0) {
            source = [];
        }
        var _this = this;
        this._map = new Map();
        this.secondProperty = 'id';
        this.remap = function (source) {
            if (source === void 0) {
                source = [];
            }
            for (var i = 0; i < source.length; i++)
                _this.getCreate(source[i][_this.keyProperty]).push(source[i]);
        };
        this.addToMap = function (source) {
            if (source === void 0) {
                source = [];
            }
            var quant = source.length;
            for (var i = 0; i < quant; i++) {
                var key = String(source[i][_this.keyProperty]);
                var subKey = String(source[i][_this.secondProperty]);
                var array = _this.getCreate(key);
                var index = array.findIndex(function (o) {
                    return o[_this.secondProperty] == subKey;
                });
                index != -1 ?
                    array.splice(index, 1, source[i])
                    :
                    array.push(source[i]);
            }
        };
        this.getCreate = function (keyProperty) {
            if (!_this.has(keyProperty))
                _this.set(keyProperty, []);
            return _this.get(keyProperty);
        };
        this.get = function (key) {
            return _this._map.get(String(key));
        };
        this.set = function (key, value) {
            return _this._map.set(String(key), value);
        };
        this.has = function (key) {
            return _this._map.has(String(key));
        };
        this.clear = function () {
            return _this._map.clear();
        };
        this.delete = function (key) {
            return _this._map.delete(String(key));
        };
        this.keyProperty = keyProperty;
        this.remap(source);
    }

    return PropertyMultiMap;
}());
exports.PropertyMultiMap = PropertyMultiMap;
