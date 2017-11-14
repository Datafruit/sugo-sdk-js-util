/**
 * uuid utils
 */
const win = window
const userAgent = win.navigator.userAgent

const uuid: () => string = (function () {

  // Time/ticks information
  // 1*new Date() is a cross browser version of Date.now()
  const T = function (): string {
    let d: number = new Date().getTime(),
      i: number = 0

    // this while loop figures how many browser ticks go by
    // before 1*new Date() returns a new number, ie the amount
    // of ticks that go by per millisecond
    while (d == new Date().getTime()) {
      i++
    }

    return d.toString(16) + i.toString(16)
  }

  // Math.Random entropy
  const R = function (): string {
    return Math.random().toString(16).replace('.', '')
  }

  // User agent entropy
  // This function takes the user agent string, and then xors
  // together each sequence of 8 bytes.  This produces a final
  // sequence of 8 bytes which it returns as hex.
  const UA = function (): string {
    let
      ua = userAgent,
      i: number,
      ch: number,
      buffer: number[] = [],
      ret = 0

    function xor(result: number, byte_array: number[]): number {
      var j, tmp = 0
      for (j = 0; j < byte_array.length; j++) {
        tmp |= (buffer[j] << j * 8)
      }
      return result ^ tmp
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i)
      buffer.unshift(ch & 0xFF)
      if (buffer.length >= 4) {
        ret = xor(ret, buffer)
        buffer = []
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer)
    }

    return ret.toString(16)
  }

  return function () {
    var se = (screen.height * screen.width).toString(16)
    return (T() + '-' + R() + '-' + UA() + '-' + se + '-' + T())
  }
})()

function short(): string {
  let d: number = new Date().getTime();
  const result: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r: number = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })
  return result
}

export {
  uuid,
  short
}