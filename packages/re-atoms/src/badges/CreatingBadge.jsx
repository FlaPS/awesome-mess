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
var Menu_1 = require("material-ui/Menu");
var elements_1 = require("./elements");
var Pure_1 = require("../smart/Pure");
var Toggle_1 = require("../smart/Toggle");
var renderAppendingRole = function (_a, onClick) {
    var roleId = _a.roleId, name = _a.name;
    return (<Menu_1.MenuItem key={roleId} onClick={function () {
        return onClick(roleId);
    }}>
        {name}
    </Menu_1.MenuItem>);
};
var messages = {
    onChange: Pure_1.messageFactory('onChange'),
};
var PureComp = Pure_1.Pure()
    .concat(Toggle_1.default)
    .addMsg(messages)
    .addReducer(function (state, action) {
        return action.type === 'onChange'
            ? __assign({}, state, {values: action.payload}) : state;
    });
var CreatingBadge = function (props) {
    return <PureComp values={props.values} roles={props.roles} onChange={props.onChange}>

        {function (_a) {
            var makeRef = _a.makeRef, pureRefs = _a.pureRefs, values = _a.values, roles = _a.roles,
                onToggle = _a.onToggle, on = _a.on, onChange = _a.onChange;
            return (<elements_1.AddBadge onClick={function () {
                return onToggle(true);
            }} ref={makeRef('badge')}>
                <elements_1.Label>Добавить роль</elements_1.Label>
                <elements_1.AddIcon/>
                <Menu_1.default open={on} onRequestClose={function () {
                    return onToggle(false);
                }} anchorEl={pureRefs['badge']}>
                    {Object.keys(roles)
                        .map(function (key) {
                            return roles[key];
                        })
                        .filter(function (vo) {
                            return !values.includes(vo.roleId);
                        })
                        .map(function (vo) {
                            return renderAppendingRole(vo, function (id) {
                                return onChange([id].concat(values));
                            });
                        })}
                </Menu_1.default>
            </elements_1.AddBadge>);
        }}

    </PureComp>;
};
exports.default = CreatingBadge;
