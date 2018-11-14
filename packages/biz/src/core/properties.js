"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var valueTypes_1 = require("./valueTypes");
exports.creationDate = valueTypes_1.default.datetime({
    langRU: 'дата создания',
});
exports.creatorUserId = valueTypes_1.default.itemOf({
    schemeName: 'USER',
    langRU: 'создал',
});
exports.name = valueTypes_1.default.string({
    required: true,
    unique: true,
    langRU: 'название',
});
exports.comment = valueTypes_1.default.string({
    langRU: 'комментарий',
});
exports.color = valueTypes_1.default.string({
    langRU: 'цвет',
});
