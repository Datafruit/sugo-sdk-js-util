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

export function isFunction(f: any): boolean {
  return typeof f === 'function'
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
