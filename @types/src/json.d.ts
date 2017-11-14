declare function encode(mixed_val: string): string;
declare const decode: (source: string) => any;
export { encode as JSONEncode, decode as JSONDecode };
