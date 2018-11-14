"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

function tryTo(func) {
    return {
        otherwise: function (value) {
            try {
                return func();
            }
            catch (e) {
            }
            return value;
        }
    };
}

exports.tryTo = tryTo;
