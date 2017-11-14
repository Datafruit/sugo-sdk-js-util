/**
 * utf8 utils
 */
export function encode(string: string): string {
  string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  let utftext: string = '',
    start: number,
    end: number
  let stringl: number = 0,
    n: number

  start = end = 0
  stringl = string.length

  for (n = 0; n < stringl; n++) {
    let c1 = string.charCodeAt(n)
    let enc = null

    if (c1 < 128) {
      end++
    } else if ((c1 > 127) && (c1 < 2048)) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128)
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128)
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length)
  }

  return utftext
}