"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var fsa_1 = require("@local/fsa");
var factory = fsa_1.actionCreatorFactory('Actors');
exports.default = {
    input: factory('INPUT'),
    output: factory('OUTPUT'),
    disconnected: factory('DISCONNECTED'),
    initialized: factory('INITIALIZED'),
};
