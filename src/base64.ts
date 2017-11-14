
/**
 * base64 utils
 */
import { encode as utf8Encode } from './utf8'

export function encode(data: string): string {
  const b64: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let
    o1: number,
    o2: number,
    o3: number,

    h1: number,
    h2: number,
    h3: number,
    h4: number,
    bits: number,
    i: number = 0,
    ac: number = 0,
    enc: string = '',
    tmp_arr: string[] = []

  if (!data) {
    return data
  }

  data = utf8Encode(data)

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++)
    o2 = data.charCodeAt(i++)
    o3 = data.charCodeAt(i++)

    bits = o1 << 16 | o2 << 8 | o3

    h1 = bits >> 18 & 0x3f
    h2 = bits >> 12 & 0x3f
    h3 = bits >> 6 & 0x3f
    h4 = bits & 0x3f

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
  } while (i < data.length)

  enc = tmp_arr.join('')

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '=='
      break
    case 2:
      enc = enc.slice(0, -1) + '='
      break
  }

  return enc
}