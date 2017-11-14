/// <reference types="ua-parser-js" />
import { InheritConstructor, UniversalityConstructor, UniversalityFunction, UniversalityObject, Throttled } from './interfaces';
import * as cookie from './cookie';
import { EventRegister } from './dom';
import * as localStorage from './localStorage';
import * as Logger from './logger';
declare const _default: {
    utf8Encode: (string: string) => string;
    UUID: () => string;
    shortUUID: () => string;
    isBrowser(): boolean;
    isFunction(f: any): boolean;
    isArguments(obj: any): boolean;
    isString(obj: any): boolean;
    isDate(obj: any): boolean;
    isNumber(obj: any): boolean;
    isElement(obj: any): boolean;
    isObject(obj: any): boolean;
    isEmptyObject(obj: any): boolean;
    isUndefined(obj: any): boolean;
    isArray: (obj: any) => boolean;
    LoggerLevel: typeof Logger.LoggerLevel;
    LoggerColor: {
        [LoggerLevel.ERROR]: string;
        [LoggerLevel.WARN]: string;
        [LoggerLevel.INFO]: string;
        [LoggerLevel.LOG]: string;
        [LoggerLevel.DEBUG]: string;
    };
    $console(...args: any[]): void;
    Logger: typeof Logger.Logger;
    base64Encode: (data: string) => string;
    info: {
        campaignParams: () => any;
        searchEngine: (referrer: string) => string;
        searchInfo: (referrer: string) => any;
        browser: (user_agent: string, vendor: string, opera: boolean) => string;
        browserVersion: (userAgent: string, vendor: string, opera: boolean) => number;
        os: () => string;
        device: (user_agent: string) => string;
        referringDomain: (referrer: string) => string;
        environment: () => IUAParser.IResult;
        properties: () => UniversalityObject;
        people_properties: () => UniversalityObject;
        pageviewInfo: (page: string) => UniversalityObject;
    };
    compressUrlQuery: (str: string) => string;
    decompressUrlQuery: (str: string) => string;
    cookie: typeof cookie;
    register_event: EventRegister;
    dom_query: (query: any) => Element[];
    JSONEncode: (mixed_val: string) => string;
    JSONDecode: (source: string) => any;
    localStorage: typeof localStorage;
    trim: (str: string) => string;
    noop: () => void;
    tryCatch: (fn: UniversalityFunction) => UniversalityFunction;
    identity: (value: any) => any;
    bind: (func: UniversalityFunction, context: any) => UniversalityFunction;
    bind_instance_methods: (obj: {
        [key: string]: UniversalityFunction;
    }) => void;
    has: (obj: UniversalityObject, key: string) => boolean;
    escapeHTML: (s: string) => string;
    formatDate: (d: Date) => string;
    encodeDates: (obj: any) => any;
    extend: (obj: UniversalityObject, ...sources: UniversalityObject[]) => UniversalityObject;
    include: (obj: any, target: any) => any;
    includes: (str: string, needle: string) => boolean;
    each: (obj: any, iterator: UniversalityFunction, context?: any) => void;
    toArray: (iterable: any) => any[];
    values: (obj: any) => any[];
    inherit: (subclass: InheritConstructor, superclass: InheritConstructor) => InheritConstructor;
    safewrap: (f: UniversalityFunction) => UniversalityFunction;
    safewrap_class: (klass: UniversalityConstructor, functions: string[]) => void;
    safewrap_instance_methods: (obj: UniversalityObject) => void;
    strip_empty_properties: (p: any) => UniversalityObject;
    truncate: (obj: any, length: number) => any;
    PlainEncode: (mixed_val: string, _dimensions: any[], serverDimensions: any[], ConfigDimensions: any[]) => string;
    isBlockedUA: (ua: string) => boolean;
    HTTPBuildQuery: (formdata: any, arg_separator?: string) => string;
    getQueryParam: (url: string, param: string) => string;
    getHashParam: (hash: string, param: string) => string;
    timestamp: () => number;
    throttle: (fn: UniversalityFunction, wait?: number) => Throttled;
    filter: (arr: any[], iterator: UniversalityFunction) => any[];
    indexOf: (arr: any[], fount: any) => number;
    keys: (object: UniversalityObject) => string[];
    pick: (object: UniversalityObject, keyOrKeys: string | string[]) => UniversalityObject;
    omit: (object: UniversalityObject, keyOrKeys: string | string[]) => UniversalityObject;
    uniq: (arr: any[]) => any[];
    clone: (obj: UniversalityObject) => any;
    map: (arr: any[], iterator: UniversalityFunction) => any[];
    find: (arr: any[], iterator: UniversalityFunction) => any;
    similar: (path: string) => string;
    is_nth_child_selector: (selector: string) => boolean;
};
export default _default;
