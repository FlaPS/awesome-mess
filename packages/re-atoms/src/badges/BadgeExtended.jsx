"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", {value: true});
var React = require("react");
var elements_1 = require("./elements");
exports.Badge = function (_a) {
    var role = _a.role, editable = _a.editable, onChange = _a.onChange,
        rest = __rest(_a, ["role", "editable", "onChange"]);
    return (<elements_1.RegularBadge key={role.roleId} color={role.color} disabled={!editable} {...rest}>
        <elements_1.Label>{role.name}</elements_1.Label>
        {editable && <elements_1.RemoveIcon onClick={function () {
            return onChange(role.roleId);
        }}/>}
    </elements_1.RegularBadge>);
};
