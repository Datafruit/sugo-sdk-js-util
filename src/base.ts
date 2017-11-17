
import {
  UniversalityFunction,
  UniversalityObject,
  UniversalityConstructor,
  InheritConstructor,
  Throttled
} from './interfaces'
import { Logger as LoggerConstructor, LoggerLevel } from './logger'
import * as Type from './type-checker'

const Logger = new LoggerConstructor('utils').setLevel(LoggerLevel.WARN)

let win: any
if (!Type.isBrowser()) {
  win = {
    navigator: {}
  }
} else {
  win = window
}

/*
 * Saved references to long variable names, so that closure compiler can
 * minimize file size.
 */
const
  ArrayProto = Array.prototype,
  FuncProto = Function.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  windowConsole = win.console,
  navigator = win.navigator,
  document = win.document,
  userAgent = navigator.userAgent

const
  nativeBind = FuncProto.bind,
  nativeForEach = ArrayProto.forEach,
  nativeIndexOf = ArrayProto.indexOf,
  nativeKeys = Object.keys,
  nativeIsArray = Array.isArray,
  breaker = {}

//
// Base functions
const _ = {

  trim: function (str: string): string {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  },

  noop: function (...args: any[]): void { },

  tryCatch: function (fn: UniversalityFunction): UniversalityFunction {
    return function () {
      try {
        return fn.apply(null, arguments)
      } catch (e) {
        return e.message
      }
    }
  },

  identity: function <T>(value: T): T {
    return value
  },

  // UNDERSCORE
  // Embed part of the Underscore Library
  bind: function (func: UniversalityFunction, context: any): UniversalityFunction {
    let args: any[], bound: UniversalityFunction
    if (nativeBind && func.bind === nativeBind) {
      return nativeBind.apply(func, slice.call(arguments, 1))
    }
    if (!Type.isFunction(func)) {
      throw new TypeError()
    }
    args = slice.call(arguments, 2)
    bound = function () {
      if (!(this instanceof bound)) {
        return func.apply(context, args.concat(slice.call(arguments)))
      }
      class Ctor { }
      Ctor.prototype = func.prototype
      let self = new Ctor()
      Ctor.prototype = null
      let result = func.apply(self, args.concat(slice.call(arguments)))
      if (Object(result) === result) {
        return result
      }
      return self
    }
    return bound
  },

  bind_instance_methods: function (obj: { [key: string]: UniversalityFunction }): void {
    for (let func in obj) {
      if (obj.hasOwnProperty(func) && typeof (obj[func]) === 'function') {
        obj[func] = _.bind(obj[func], obj)
      }
    }
  },

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  // 判断对象中是否有指定 key
  // own properties, not on a prototype
  has: function (obj: UniversalityObject, key: string): boolean {
    // obj 不能为 null 或者 undefined
    return obj !== null && hasOwnProperty.call(obj, key);
  },

  escapeHTML: function (s: string): string {
    let escaped = s
    if (escaped && Type.isString(escaped)) {
      escaped = escaped
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }
    return escaped
  },

  formatDate: function (d: Date): string {
    // YYYY-MM-DDTHH:MM:SS in UTC
    function pad(n: number) {
      return n < 10 ? '0' + n : n
    }

    return d.getUTCFullYear() + '-' +
      pad(d.getUTCMonth() + 1) + '-' +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + ':' +
      pad(d.getUTCMinutes()) + ':' +
      pad(d.getUTCSeconds())
  },

  encodeDates: function (obj: any) {
    _.each(obj, function (v, k) {
      if (Type.isDate(v)) {
        obj[k] = _.formatDate(v)
      } else if (Type.isObject(v)) {
        obj[k] = _.encodeDates(v) // recurse
      }
    })
    return obj
  },

  extend: function (obj: UniversalityObject, ...sources: UniversalityObject[]): UniversalityObject {
    _.each(sources, function (source) {
      for (let prop in source) {
        if (source[prop] !== void 0) {
          obj[prop] = source[prop]
        }
      }
    })
    return obj
  },

  include: function (obj: any, target: any): any {
    let found = false
    if (obj === null) {
      return found
    }
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return _.indexOf(obj, target) > -1
    }
    _.each(obj, function (value) {
      if (found || (found = (value === target))) {
        return breaker
      }
    })
    return found
  },

  includes: function (str: string, needle: string): boolean {
    return str.indexOf(needle) !== -1
  },

  each: function (obj: any, iterator: UniversalityFunction, context?: any): void {
    if (obj === null || obj === undefined) {
      return
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context)
    } else if (obj.length === +obj.length) {
      for (let i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
          return
        }
      }
    } else {
      for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) {
            return
          }
        }
      }
    }
  },

  toArray: function (iterable: any): any[] {
    if (!iterable) {
      return []
    }
    if (iterable.toArray) {
      return iterable.toArray()
    }
    if (Type.isArray(iterable)) {
      return slice.call(iterable)
    }
    if (Type.isArguments(iterable)) {
      return slice.call(iterable)
    }
    return _.values(iterable)
  },

  values: function (obj: any): any[] {
    const results: any[] = []
    if (obj === null) {
      return results
    }
    _.each(obj, function (value) {
      results[results.length] = value
    })
    return results
  },

  inherit: function (subclass: InheritConstructor, superclass: InheritConstructor): InheritConstructor {
    subclass.prototype = new superclass()
    subclass.prototype.varructor = subclass
    subclass.superclass = superclass.prototype
    return subclass
  },

  safewrap: function (f: UniversalityFunction): UniversalityFunction {
    return function () {
      try {
        return f.apply(this, arguments)
      } catch (e) {
        Logger.error('执行错误. 请联系 support@sugo.io => ' + e.stack)
      }
    }
  },

  safewrap_class: function (klass: UniversalityConstructor, functions: string[]): void {
    for (let i = 0; i < functions.length; i++) {
      klass.prototype[functions[i]] = _.safewrap(klass.prototype[functions[i]])
    }
  },

  safewrap_instance_methods: function (obj: UniversalityObject): void {
    for (let func in obj) {
      if (typeof (obj[func]) === 'function') {
        obj[func] = _.safewrap(obj[func])
      }
    }
  },

  strip_empty_properties: function (p: any): UniversalityObject {
    let ret: UniversalityObject = {}
    _.each(p, function (v, k) {
      if (Type.isString(v) && v.length > 0) {
        ret[k] = v
      }
    })
    return ret
  },

  /*
   * this function returns a copy of object after truncating it.  If
   * passed an Array or Object it will iterate through obj and
   * truncate all the values recursively.
   */
  truncate: function (obj: any, length: number): any {
    let ret: any

    if (typeof (obj) === 'string') {
      ret = obj.slice(0, length)
    } else if (Type.isArray(obj)) {
      ret = []
      _.each(obj, function (val) {
        ret.push(_.truncate(val, length))
      })
    } else if (Type.isObject(obj)) {
      ret = {}
      _.each(obj, function (val, key) {
        ret[key] = _.truncate(val, length)
      })
    } else {
      ret = obj
    }

    return ret
  },

  PlainEncode: function (
    mixed_val: string,
    _dimensions: Array<any>,
    serverDimensions: any[],
    ConfigDimensions: any[]
  ): string | null {
    if (!serverDimensions || serverDimensions.length < 1) {
      return null
    }
    // 维度类型：0=long,1=float,2=string;3=dateString;4=date
    const DRUID_COLUMN_TYPE: { [key: number]: string } = {
      0: 'l',
      1: 'f',
      2: 's',
      3: 's',
      4: 'd',
      5: 'i'
    }
    const dimensionsObj: any = {}
    _.each(serverDimensions, function (dim: any) {
      dimensionsObj[dim.name] = DRUID_COLUMN_TYPE[dim.type]
    })
    const value = mixed_val
    const EVENTS_MAPS: { [key: string]: string } = { //事件名称映射为中文
      click: '点击',
      change: '改变',
      // submit: '提交',
      focus: '对焦',
      view: '浏览',
      duration: '停留',
      pageloading: '加载',
      first_visit: '首次访问',
      first_login: '首次登录'
    }
    const HEADER_SPLIT = '\x02' //\002
    const CONTENT_SPLIT = '\x01' //\001
    const dimensions = _dimensions ? _dimensions : ConfigDimensions //配置跨域是instance里的
    //s|name,i|age,d|birth\002myName\00125\001672508800000\002yourName\00124\001694926294000
    const formatFn = function (data: any): any[] {
      let res: any[] = [], v, k, item

      for (k in data) {
        if (!_.has(data, k)) continue
        item = data[k]
        if (Type.isObject(item) && k === 'properties') {
          v = formatFn(item)
          if (v) {
            res = res.concat(v)
          }
        } else if (Type.isArray(item)) {
          v = formatFn(item)
        } else {
          // if (dimensions) { //r如果配置了映射维度信息，替换上报的维度信息
          //   var target_key = dimensions[dim]
          //   dim = target_key ? target_key : dim
          // }
          if (dimensionsObj[k]) {
            var _key = dimensionsObj[k] + '|' + k
            var val = item
            if (k === 'event_type') {
              val = EVENTS_MAPS[item]
              if (val === void 0) {
                Logger.warn('event_type is undefined!')
              }
            } else {
              Logger.log('sugoio track Illegal dimension => ' + k)
            }
            res.push(_key + HEADER_SPLIT + val)
          }
        }
      }
      return res
    }
    // _.value(serverDimensions)
    const results = formatFn(value)
    let keys: any[] = [], vals: any[] = []
    _.each(results, function (val, idx) {
      var arr = val.split(HEADER_SPLIT)
      keys.push(arr[0])
      vals.push(arr[1])
    })
    const res = keys.join(',') + HEADER_SPLIT + vals.join(CONTENT_SPLIT)
    return res
  },

  isBlockedUA: function (ua: string): boolean {
    if (/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(ua)) {
      return true
    }
    return false
  },

  HTTPBuildQuery: function (formdata: any, arg_separator?: string): string {
    let
      use_val: string,
      use_key: string,
      tmp_arr: string[] = []

    if (Type.isUndefined(arg_separator)) {
      arg_separator = '&'
    }

    _.each(formdata, function (val, key) {
      use_val = encodeURIComponent(val.toString())
      use_key = encodeURIComponent(key)
      tmp_arr[tmp_arr.length] = use_key + '=' + use_val
    })

    return tmp_arr.join(arg_separator)
  },

  getQueryParam: function (url: string, param: string): string {
    // Expects a raw URL
    param = param.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
    var regexS = '[\\?&]' + param + '=([^&#]*)',
      regex = new RegExp(regexS),
      results = regex.exec(url)
    if (results === null || (results && typeof (results[1]) !== 'string' && results[1].length)) {
      return ''
    } else {
      return decodeURIComponent(results[1]).replace(/\+/g, ' ')
    }
  },

  getHashParam: function (hash: string, param: string): string | null {
    const matches = hash.match(new RegExp(param + '=([^&]*)'))
    return matches ? matches[1] : null
  },

  timestamp: function (): number {
    Date.now = Date.now || function () {
      return +new Date
    }
    return Date.now()
  },

  /**
   * 参考underscore.throttle方法
   * 一个函数指定的wait时间内无论调用了多少次只执行一次,
   * 如果当次没有执行,返回上一次的执行结果
   * @param fn
   * @param wait
   * @returns {Function}
   */
  throttle: function (fn: UniversalityFunction, wait?: number): Throttled {
    wait = wait || 0

    let
      prev: number = _.timestamp(),
      context: any,
      result: any,
      timer: any,
      args: any[] | null

    const later = function () {
      prev = _.timestamp();
      result = fn.apply(context, args);
      args = context = null;
    };

    const throttled: any = function (..._args: any[]): any {
      let now = _.timestamp()
      let remaining = wait - (now - prev)

      // 缓存参数和作用域,以便给later调用
      args = _args
      context = this

      // 可以执行
      if (remaining <= 0) {
        // 清除之前的定时器
        if (timer) {
          timer = null
          clearTimeout(timer)
        }
        // 执行原函数并更改记录时间
        prev = now;
        // 更新result
        result = fn.apply(context, args)

        // 如果定时器已经清除了,那么回收所有的缓存
        if (!timer) {
          args = context = null
        }
      }
      // 需要延时执行
      else if (!timer) {
        timer = setTimeout(later, remaining)
      }

      // result可能是当次执行结果,也可能是上次执行结果
      return result
    }

    // 取消定时执行后,重置所有参数
    throttled.cancel = function () {
      clearTimeout(timer);
      prev = 0;
      args = context = timer = null;
    }

    return <Throttled>throttled
  },

  filter: function (arr: any[], iterator: UniversalityFunction): any[] {
    const result: any[] = []
    _.each(arr, function (v: any, i: number) {
      if (iterator(v, i, arr)) {
        result.push(v)
      }
    })
    return result
  },

  indexOf: function (arr: any[], fount: any): number {
    const length = arr.length
    let i: number
    let temp: any

    for (i = 0; i < length; i++) {
      temp = arr[i]
      if (temp === fount) {
        return i
      }
    }
    return -1
  },

  keys: function (object: UniversalityObject): string[] {
    if (nativeKeys) {
      return nativeKeys.call(Object, object)
    }
    const results: string[] = []
    for (let prop in object) {
      if (hasOwnProperty.call(object, prop)) {
        results.push(prop)
      }
    }
    return results
  },

  pick: function (object: UniversalityObject, keyOrKeys: string | string[]): UniversalityObject {
    let keys: string[]
    if (typeof keyOrKeys === 'string') {
      keys = [keyOrKeys]
    } else {
      keys = keyOrKeys
    }

    const result: UniversalityObject = {}
    _.each(keys, function (key: string) {
      result[key] = object[key]
    })
    return result
  },

  omit: function (object: UniversalityObject, keyOrKeys: string | string[]): UniversalityObject {
    const oKeys: string[] = _.keys(object)

    let keys: string[]
    if (typeof keyOrKeys === 'string') {
      keys = [keyOrKeys]
    } else {
      keys = keyOrKeys
    }
    return _.pick(object, _.filter(oKeys, function (key) {
      return _.indexOf(keys, key) < 0
    }))
  },

  uniq: function (arr: any[]): any[] {
    const dup: any[] = []
    let i = 0
    let len = arr.length
    let ret: any[] = []
    let tmp: any

    for (; i < len; i++) {
      tmp = arr[i]
      if (_.indexOf(dup, tmp) === -1) {
        dup.push(tmp)
        ret.push(tmp)
      }
    }

    return ret
  },

  clone: typeof JSON === 'object'
    ? function (obj: UniversalityObject): any {
      return JSON.parse(JSON.stringify(obj))
    }
    : function (obj: any): any {
      const isObj: boolean = Type.isObject(obj)
      const isArr: boolean = Type.isArray(obj)
      if (!isObj && !isArr) {
        return obj
      }
      const result: any = isObj ? {} : []
      _.each(obj, function (val: any, key: string) {
        if (Type.isObject(val) || Type.isArray(val)) {
          result[key] = _.clone(val)
        } else {
          result[key] = val
        }
      })
      return result
    },

  map: function (arr: any[], iterator: UniversalityFunction): any[] {
    const result: any[] = []
    let i = 0
    let len = arr.length

    for (; i < len; i++) {
      result.push(iterator(arr[i], i, arr))
    }

    return result
  },

  find: function (arr: any[], iterator: UniversalityFunction): any {
    let result: any = null
    let i = 0
    let len = arr.length

    for (; i < len; i++) {
      if (iterator(arr[i], i, arr)) {
        result = arr[i]
        break
      }
    }

    return result
  },

  similar: (function () {
    const reg = /(?:[a-zA-Z]+:nth-child\((.+?)\))/g
    /**
     * 根据路径生成同类元素路径
     * @param {string} path
     * @return {?string}
     */
    return function (path: string): string {
      if (!path) return null
      return path.replace(reg, function (a: string, b: string) {
        return a.replace(b, 'n')
      })
    }
  })(),

  is_nth_child_selector: function (selector: string): boolean {
    if (!selector) return false
    return /(?:[a-zA-Z]+:nth-child\(.+?\))/.test(selector)
  }
}

export default _
