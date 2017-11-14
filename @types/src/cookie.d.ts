export declare function get(name: string): string | null;
export declare function parse(name: string): any;
export declare function set_seconds(name: string, value: string, seconds: number, cross_subdomain?: boolean, is_secure?: boolean): void;
export declare function set(name: string, value: string, days: number, cross_subdomain?: boolean, is_secure?: boolean): string;
export declare function remove(name: string, cross_subdomain?: boolean): void;
