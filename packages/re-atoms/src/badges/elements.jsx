"use strict";
var __assign = (this && this.__assign) || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", {value: true});
var React = require("react");
var IconButton_1 = require("material-ui/IconButton");
var SVGLibrary_1 = require("../styles/SVGLibrary");
var restyle_1 = require("../restyle");
var font_1 = require("../styles/font");
var Span_1 = require("../layout/Span");
var ramda_1 = require("ramda");
var grayColor = 'rgba(0,0,0,0.38)';
var grayTextColor = 'rgba(0,0,0,0.54)';
var buttonStyle = {width: 24, height: 24, flex: 'none', marginLeft: 8};
var forIcon = ramda_1.omit(['flex', 'marginLeft']);
var Badge = font_1.body1((_a = ["\n    max-width: 100%;\n    box-sizing: border-box;\n    height: 32px;\n    font-size: 13px;\n    line-height: 32px;\n    text-align: center;\n\n    border-radius: 100px;\n    border-width: 1px;\n\n    margin: 0 6px 8px 0;\n    padding: 0 12px;\n"], _a.raw = ["\n    max-width: 100%;\n    box-sizing: border-box;\n    height: 32px;\n    font-size: 13px;\n    line-height: 32px;\n    text-align: center;\n\n    border-radius: 100px;\n    border-width: 1px;\n\n    margin: 0 6px 8px 0;\n    padding: 0 12px;\n"], restyle_1.restyle(_a)))(Span_1.default);
exports.RegularBadge = (_b = ["\n    ", "\n\n    background-color: ", ";\n    border-color: ", ";\n    border-style: solid;\n    color: white;\n"], _b.raw = ["\n    ",
    "\n\n    background-color: ", ";\n    border-color: ", ";\n    border-style: solid;\n    color: white;\n"], restyle_1.restyle(_b, function (_a) {
    var disabled = _a.disabled;
    return !disabled ? "\n        display: flex;\n        align-items: center;\n\n        padding: 0 8px 0 12px;\n    " : '';
}, function (_a) {
    var color = _a.color;
    return color;
}, function (_a) {
    var color = _a.color;
    return color;
}))(Badge);
exports.Label = (_c = ["\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    flex: 0 1 auto;\n    max-width: 100%;\n    box-sizing: border-box;\n    display: inline-block;\n"], _c.raw = ["\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    flex: 0 1 auto;\n    max-width: 100%;\n    box-sizing: border-box;\n    display: inline-block;\n"], restyle_1.restyle(_c))(Span_1.default);
exports.AddBadge = (_d = ["\n    display: flex;\n    align-items: center;\n    padding: 0 4.5px 0 12.5px;\n    color: ", ";\n    border-color: ", ";\n    border-style: dashed;\n    cursor: pointer;\n"], _d.raw = ["\n    display: flex;\n    align-items: center;\n    padding: 0 4.5px 0 12.5px;\n    color: ", ";\n    border-color: ", ";\n    border-style: dashed;\n    cursor: pointer;\n"], restyle_1.restyle(_d, grayTextColor, grayColor))(Badge);
exports.RemoveIcon = function (props) {
    return <IconButton_1.default style={__assign({}, buttonStyle)} {...props}>
        <SVGLibrary_1.Library.DeleteCross style={__assign({}, forIcon(buttonStyle))} fill='white'/>
    </IconButton_1.default>;
};
exports.AddIcon = function (props) {
    return <IconButton_1.default style={__assign({}, buttonStyle)} {...props}>
        <SVGLibrary_1.Library.AddButton style={__assign({}, forIcon(buttonStyle))} fill={grayColor}/>
    </IconButton_1.default>;
};
var _a, _b, _c, _d;
