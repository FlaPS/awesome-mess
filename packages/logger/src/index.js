"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var utils_1 = require("@local/utils");
var file_data_1 = require("@local/file-data");
var ramda_1 = require("ramda");
var transport = console;
var namespaces = new Map();
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["LOG"] = 1] = "LOG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.defaultLoggerConfig = {
    logToFile: true,
    loggers: {
        default: 0
    }
};
var setUpBackendLogger = function (config) {
    if (config.logToFile) {
        transport = require('./back/fileTransport').createFileTransport();
    }
    else {
        transport = console;
    }
    exports.defaultLoggerConfig = ramda_1.mergeDeepLeft(exports.defaultLoggerConfig, config);
};
if (utils_1.isBackend) {
    setUpBackendLogger(file_data_1.getConfigRepositry('logger', exports.defaultLoggerConfig).getData());
}
var decorateWriter = function (namespace) {
    return function (level) {
        return function (writer) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var space = (exports.defaultLoggerConfig[namespace] !== undefined) ? namespace : 'default';
                var settingsValue = exports.defaultLoggerConfig.hasOwnProperty(space) ? exports.defaultLoggerConfig[space] : exports.defaultLoggerConfig['default'];
                if (settingsValue <= level) {
                    switch (level) {
                        case 0:
                            var fnc = (transport.debug ? transport.debug : transport.log);
                            fnc(namespace + ':' + args.map(JSON.stringify).join(', '));
                            break;
                        case 1:
                            transport.log(namespace + ':' + args.map(JSON.stringify).join(', '));
                            break;
                        case 2:
                            transport.info(namespace + ':' + args.map(JSON.stringify).join(', '));
                            break;
                        case 3:
                            transport.warn(namespace + ':' + args.map(JSON.stringify).join(', '));
                            break;
                        case 4:
                            transport.error(namespace + ':' + args.map(JSON.stringify).join(', '));
                            break;
                    }
                }
            };
        };
    };
};
var createLogger = function (transport) {
    return function (namespace) {
        return ({
            debug: decorateWriter(namespace)(0)(transport.debug),
            log: decorateWriter(namespace)(1)(transport.log),
            info: decorateWriter(namespace)(2)(transport.info),
            warn: decorateWriter(namespace)(3)(transport.warn),
            error: decorateWriter(namespace)(4)(transport.error),
        });
    };
};
exports.getLogger = function (namespace) {
    return namespaces.has(namespace) ?
        namespaces.get(namespace)
        :
        namespaces.set(namespace, createLogger(transport)(namespace)).get(namespace);
};
