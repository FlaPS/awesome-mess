"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var ReferenceScheme_1 = require("./ReferenceScheme");
var contractorTypeLang = {
    singular: 'подрядчик',
    plural: 'подрядчиков',
    some: 'подрядчика',
    name: 'подрядчики',
    gender: 'm',
};
exports.CONTRACTOR_TYPE = ReferenceScheme_1.createReferenceScheme('CONTRACTOR_TYPE', contractorTypeLang);
