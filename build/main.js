var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
System.register("logger", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function $console() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var console = window.console;
        if (console && console.log && typeof console.log.apply === 'function') {
            console.log.apply(console, args);
        }
    }
    var LoggerLevel, LoggerColor, Logger, _a;
    return {
        setters: [],
        execute: function () {
            (function (LoggerLevel) {
                LoggerLevel[LoggerLevel["ERROR"] = 0] = "ERROR";
                LoggerLevel[LoggerLevel["WARN"] = 1] = "WARN";
                LoggerLevel[LoggerLevel["INFO"] = 2] = "INFO";
                LoggerLevel[LoggerLevel["LOG"] = 3] = "LOG";
                LoggerLevel[LoggerLevel["DEBUG"] = 4] = "DEBUG";
            })(LoggerLevel || (LoggerLevel = {}));
            LoggerColor = (_a = {},
                _a[LoggerLevel.ERROR] = '#ff4949',
                _a[LoggerLevel.WARN] = '#f7ba2a',
                _a[LoggerLevel.INFO] = '#50bfff',
                _a[LoggerLevel.LOG] = '#333',
                _a[LoggerLevel.DEBUG] = '#6969d7',
                _a);
            exports_1("LoggerColor", LoggerColor);
            Logger = (function () {
                function Logger(scope, level, console) {
                    if (level === void 0) { level = LoggerLevel.DEBUG; }
                    if (console === void 0) { console = $console; }
                    this.scope = scope ? (scope + '->') : '';
                    this.level = level;
                    this.console = console;
                    this.color = __assign({}, LoggerColor);
                }
                Logger.prototype.prefix = function (level, args) {
                    var color = this.color[level];
                    if (!color) {
                        return args;
                    }
                    var prefix = '%c' + (this.scope || '') + '[' + level + ']%c: ';
                    var first = args[0];
                    if (typeof first === 'string') {
                        prefix = prefix + first;
                        args = args.slice(1);
                    }
                    return [
                        prefix,
                        'color:' + color + ';font-weight:bold;',
                        'color:' + this.color.log
                    ].concat(args);
                };
                Logger.prototype.wrapper = function (level, args) {
                    if (this.level < level) {
                        return this;
                    }
                    this.console(this.prefix(level, args));
                    return this;
                };
                Logger.prototype.setLevel = function (level) {
                    this.level = level;
                    return this;
                };
                Logger.prototype.error = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return this.wrapper(LoggerLevel.ERROR, args);
                };
                Logger.prototype.warn = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return this.wrapper(LoggerLevel.WARN, args);
                };
                Logger.prototype.info = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return this.wrapper(LoggerLevel.INFO, args);
                };
                Logger.prototype.log = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return this.wrapper(LoggerLevel.LOG, args);
                };
                Logger.prototype.debug = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return this.wrapper(LoggerLevel.DEBUG, args);
                };
                return Logger;
            }());
            exports_1("Logger", Logger);
        }
    };
});
//# sourceMappingURL=main.js.map