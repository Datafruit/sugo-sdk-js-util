/**
 * Type checkers
 */

const hasOwnProperty = Object.prototype.hasOwnProperty
const toString = Object.prototype.toString

export function isBrowser(): boolean {
  let is = false
  try {
    is = typeof window !== 'undefined'
  } catch (e) {
    is = false
  }
  return is
}

// from a comment on http://dbj.org/dbj/?p=286
// fails on only one very rare and deliberate custom object:
// var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
// but error in es6...
// example:
// ```js
// var fn = () => {}
// _.isFunction(fn) // false
//```
// But fn is a really really function

export function isFunction(f: any): boolean {
  try {
    return /^\s*\bfunction\b/.test(f)
  } catch (x) {
    return false
  }
}

export function isArguments(obj: any): boolean {
  return !!(obj && hasOwnProperty.call(obj, 'callee'))
}

export function isString(obj: any): boolean {
  return toString.call(obj) === '[object String]'
}

export function isDate(obj: any): boolean {
  return toString.call(obj) === '[object Date]'
}

export function isNumber(obj: any): boolean {
  return toString.call(obj) === '[object Number]'
}

export function isElement(obj: any): boolean {
  return !!(obj && obj.nodeType === 1)
}

export function isObject(obj: any): boolean {
  return (obj === Object(obj) && !isArray(obj))
}

export function isEmptyObject(obj: any): boolean {
  if (isObject(obj)) {
    for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false
      }
    }
    return true
  }
  return false
}

export function isUndefined(obj: any): boolean {
  return obj === void 0
}

export const isArray = Array.isArray || function (obj: any): boolean {
  return toString.call(obj) === '[object Array]'
}
