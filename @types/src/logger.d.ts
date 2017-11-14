export declare enum LoggerLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    LOG = 3,
    DEBUG = 4,
}
export declare const LoggerColor: {
    [LoggerLevel.ERROR]: string;
    [LoggerLevel.WARN]: string;
    [LoggerLevel.INFO]: string;
    [LoggerLevel.LOG]: string;
    [LoggerLevel.DEBUG]: string;
};
export declare function $console(...args: any[]): void;
export declare class Logger {
    private console;
    private scope;
    private level;
    private color;
    constructor(scope?: string, level?: LoggerLevel, console?: typeof $console);
    private prefix(level, args);
    private wrapper(level, args);
    setLevel(level: LoggerLevel): this;
    error(...args: any[]): this;
    warn(...args: any[]): this;
    info(...args: any[]): this;
    log(...args: any[]): this;
    debug(...args: any[]): this;
}
