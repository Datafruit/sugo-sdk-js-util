/**
 * compress query
 */

import * as LZString from 'lz-string'
import { isObject } from './type-checker'
import { JSONEncode } from './json'

export function compressUrlQuery(str: string): string {
  if (isObject(str)) {
    str = JSONEncode(str)
  }
  return LZString.compressToEncodedURIComponent(str)
}

export function decompressUrlQuery(str: string): string {
  return LZString.decompressFromEncodedURIComponent(str)
}
