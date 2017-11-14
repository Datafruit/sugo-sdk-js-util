
const hasOwnProperty = Object.prototype.hasOwnProperty
const toString = Object.prototype.toString

import * as Type from './type-checker'

function encode(mixed_val: string): string {
  let value = mixed_val
  let quote = function (string: string): string {
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
    var meta: { [key: string]: string } = { // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    }

    escapable.lastIndex = 0
    return escapable.test(string) ? '"' + string.replace(escapable, function (a: string) {
      var c: string = meta[a]
      return Type.isString(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
  }

  let str = function (key: string, holder: any): any {
    let gap = ''
    let indent = '    '
    let i = 0 // The loop counter.
    let k = '' // The member key.
    let v = '' // The member value.
    let length = 0
    let mind = gap
    let partial: any[] = []
    let value = holder[key]

    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }

    if (value === null) {
      return String(value)
    }

    // What happens next depends on the value's type.
    switch (typeof value) {
      case 'string':
        return quote(value)

      case 'number':
        // JSON numbers must be finite. Encode non-finite numbers as null.
        return isFinite(value) ? String(value) : 'null'

      case 'boolean':
        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce 'null'. The case is included here in
        // the remote chance that this gets fixed someday.
        return String(value)

      case 'object':
        // If the type is 'object', we might be dealing with an object or an array or
        // null.
        // Due to a specification blunder in ECMAScript, typeof null is 'object',
        // so watch out for that case.
        if (!value) {
          return 'null'
        }

        // Make an array to hold the partial results of stringifying this object value.
        gap += indent
        partial = []

        // Is the value an array?
        if (toString.apply(value) === '[object Array]') {
          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i.toString(), value) || 'null'
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.
          v = partial.length === 0 ? '[]' : gap ? '[\n' + gap +
            partial.join(',\n' + gap) + '\n' +
            mind + ']' : '[' + partial.join(',') + ']'
          gap = mind
          return v
        }

        // Iterate through all of the keys in the object.
        for (k in value) {
          if (hasOwnProperty.call(value, k)) {
            v = str(k, value)
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v)
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.
        v = partial.length === 0 ? '{}' : gap ? '{' + partial.join(',') + '' +
          mind + '}' : '{' + partial.join(',') + '}'
        gap = mind
        return v
    }
  }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  return str('', { '': value })
}

const decode = (function () { // https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
  let
    at: any, // The index of the current character
    ch: any, // The current character
    escapee: { [key: string]: string } = {
      '"': '"',
      '\\': '\\',
      '/': '/',
      'b': '\b',
      'f': '\f',
      'n': '\n',
      'r': '\r',
      't': '\t'
    },
    text: any,
    error = function (m: string) {
      throw {
        name: 'SyntaxError',
        message: m,
        at: at,
        text: text
      }
    },
    next = function (c?: string): string {
      // If a c parameter is provided, verify that it matches the current character.
      if (c && c !== ch) {
        error('Expected \'' + c + '\' instead of \'' + ch + '\'')
      }
      // Get the next character. When there are no more characters,
      // return the empty string.
      ch = text.charAt(at)
      at += 1
      return ch
    },
    number = function () {
      // Parse a number value.
      var number,
        string = ''

      if (ch === '-') {
        string = '-'
        next('-')
      }
      while (ch >= '0' && ch <= '9') {
        string += ch
        next()
      }
      if (ch === '.') {
        string += '.'
        while (next() && ch >= '0' && ch <= '9') {
          string += ch
        }
      }
      if (ch === 'e' || ch === 'E') {
        string += ch
        next()
        if (ch === '-' || ch === '+') {
          string += ch
          next()
        }
        while (ch >= '0' && ch <= '9') {
          string += ch
          next()
        }
      }
      number = +string
      if (!isFinite(number)) {
        error('Bad number')
      } else {
        return number
      }
    },

    string = function () {
      // Parse a string value.
      var hex,
        i,
        string = '',
        uffff
      // When parsing for string values, we must look for " and \ characters.
      if (ch === '"') {
        while (next()) {
          if (ch === '"') {
            next()
            return string
          }
          if (ch === '\\') {
            next()
            if (ch === 'u') {
              uffff = 0
              for (i = 0; i < 4; i += 1) {
                hex = parseInt(next(), 16)
                if (!isFinite(hex)) {
                  break
                }
                uffff = uffff * 16 + hex
              }
              string += String.fromCharCode(uffff)
            } else if (typeof escapee[ch] === 'string') {
              string += escapee[ch]
            } else {
              break
            }
          } else {
            string += ch
          }
        }
      }
      error('Bad string')
    },
    white = function () {
      // Skip whitespace.
      while (ch && ch <= ' ') {
        next()
      }
    },
    word = function () {
      // true, false, or null.
      switch (ch) {
        case 't':
          next('t')
          next('r')
          next('u')
          next('e')
          return true
        case 'f':
          next('f')
          next('a')
          next('l')
          next('s')
          next('e')
          return false
        case 'n':
          next('n')
          next('u')
          next('l')
          next('l')
          return null
      }
      error('Unexpected "' + ch + '"')
    },
    value: any, // Placeholder for the value function.
    array = function (): any[] {
      // Parse an array value.
      let array: any[] = []

      if (ch === '[') {
        next('[')
        white()
        if (ch === ']') {
          next(']')
          return array // empty array
        }
        while (ch) {
          array.push(value())
          white()
          if (ch === ']') {
            next(']')
            return array
          }
          next(',')
          white()
        }
      }
      error('Bad array')
    },
    object = function () {
      // Parse an object value.
      let key, object: any = {}

      if (ch === '{') {
        next('{')
        white()
        if (ch === '}') {
          next('}')
          return object // empty object
        }
        while (ch) {
          key = string()
          white()
          next(':')
          if (hasOwnProperty.call(object, key)) {
            error('Duplicate key "' + key + '"')
          }
          object[key] = value()
          white()
          if (ch === '}') {
            next('}')
            return object
          }
          next(',')
          white()
        }
      }
      error('Bad object')
    }

  value = function () {
    // Parse a JSON value. It could be an object, an array, a string,
    // a number, or a word.
    white()
    switch (ch) {
      case '{':
        return object()
      case '[':
        return array()
      case '"':
        return string()
      case '-':
        return number()
      default:
        return ch >= '0' && ch <= '9' ? number() : word()
    }
  }

  // Return the json_parse function. It will have access to all of the
  // above functions and variables.
  return function (source: string): any {
    var result

    text = source
    at = 0
    ch = ' '
    result = value()
    white()
    if (ch) {
      error('Syntax error')
    }

    return result
  }
})()

export {
  encode as JSONEncode,
  decode as JSONDecode
}
