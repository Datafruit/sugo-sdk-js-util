/// <reference types="ua-parser-js" />
import { UniversalityObject } from './interfaces';
declare const Info: {
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
export default Info;
