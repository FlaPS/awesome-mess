"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var fs = require("fs");
var file_data_1 = require("@local/file-data");
var path = require("path");
exports.createFileTransport = function () {
    var logDirectory = path.join(file_data_1.default.getAppDataPath(), 'log');
    var logFileName = path.join(logDirectory, 'last.log');
    console.log('log', logDirectory, logFileName);
    if (!fs.existsSync(logDirectory))
        fs.mkdirSync(logDirectory);
    if (!fs.existsSync(logFileName)) {
        console.log('Log file is not exists.  create new one', logFileName);
        fs.writeFileSync(logFileName, 'Start log', {flag: 'w', encoding: 'utf8'});
    }
    var stream = fs.createWriteStream(logFileName, {flags: 'a+', encoding: 'utf8'});
    var getHumanTime = function () {
        var date = new Date();
        return date.getFullYear() + "/" +
            date.getMonth() + "/" +
            date.getDate() + " " +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            date.getSeconds();
    };
    var fileTransport = {
        debug: function (message) {
            stream.write('DEBUG @ ' + getHumanTime() + ' ' + message + '\r\n');
        },
        log: function (message) {
            stream.write('LOG @ ' + getHumanTime() + ' ' + message + '\r\n');
        },
        info: function (message) {
            stream.write('INFO @ ' + getHumanTime() + ' ' + message + '\r\n');
        },
        warn: function (message) {
            stream.write('WARN @ ' + getHumanTime() + ' ' + message + '\r\n');
        },
        error: function (message) {
            stream.write('ERROR @ ' + getHumanTime() + ' ' + message + '\r\n');
        },
    };
    return fileTransport;
};
