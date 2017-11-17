/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   16/11/2017
 * @description
 */

import 'mocha'
import { ok, equal } from 'assert'
import _ from '../src/base'
import { UniversalityFunction } from '../src/interfaces'

describe('Base Test cases', function () {
  describe('_.trim(str: string): string', function () {
    const cases: [string, string][] = [
      ['', ''],
      ['ab', 'ab'],
      [' ab', 'ab'],
      ['ab ', 'ab'],
      [' ab ', 'ab'],
      ['a b', 'a b'],
      [' a b', 'a b'],
      ['a b ', 'a b'],
      [' a b ', 'a b']
    ]

    cases.forEach(function ([input, output]) {
      it(`_.trim('${input}') should return '${output}'`, function () {
        equal(_.trim(input), output)
      })
    })
  })

  describe('_.noop(): void', function () {
    const obj: any = {}
    const arr: any[] = []
    const cases: [any, any][] = [
      [0, void 0],
      ['s', void 0],
      [null, void 0],
      [obj, void 0],
      [arr, void 0]
    ]

    cases.forEach(function ([param, result]) {
      it(`_.noop(${param}) should return ${result}`, function () {
        equal(_.noop(param), result)
      })
    })
  })

  describe('_.tryCatch(fn: UniversalityFunction): UniversalityFunction', function () {
    const cases: [UniversalityFunction, any][] = [
      [function () { throw new Error('message') }, 'message'],
      [function () { return 1 }, 1],
      [function () { return null }, null],
      [function () { throw { message: 0 } }, 0]
    ]
    cases.forEach(function ([fn, result]) {
      it(`_.tryCatch(${fn.toString()}) called should return ${result}`, function () {
        equal(_.tryCatch(fn)(), result)
      })
    })
  })

  describe('_.identify<T>(value: T): T', function () {
    const obj: any = {}
    const arr: any[] = []
    const cases: [any, any][] = [
      [0, 0],
      ['s', 's'],
      [null, null],
      [obj, obj],
      [arr, arr]
    ]

    cases.forEach(function ([param, result]) {
      it(`_.identify(${param}) should return ${result}`, function () {
        equal(_.identity(param), result)
      })
    })
  })

  describe('_.bind(func: UniversalityFunction): UniversalityFunction', function () {
    const arr: string[] = ['a']
    const obj: { [key: string]: string } = { 'k': 'v' }
    function fn<T>(): T { return this }

    const cases: [UniversalityFunction, any][] = [
      [_.bind(fn, 0), 0],
      [_.bind(fn, null), null],
      [_.bind(fn, 'a'), 'a'],
      [_.bind(fn, arr), arr],
      [_.bind(fn, obj), obj]
    ]

    cases.forEach(function ([fns, result]) {
      it(`_.bind(${fn.toString()}, ${result}) called should will return ${result}`, function () {
        equal(fns(), result)
      })
    })
  })

  describe('_.bind_instance_methods(obj: { [key: string]: UniversalityFunction }): void', function () {
    const obj: { [key: string]: UniversalityFunction } = {
      a: function () { return this },
      b: function () { return this },
      c: function () { return this }
    }

    it(`_.bind_instance_methods(${JSON.stringify(obj)}) should bind all methods to it's own object`, function () {
      _.bind_instance_methods(obj)
      for (let name in obj) {
        if (obj.hasOwnProperty(name)) {
          equal(obj[name](), obj)
        }
      }
    })
  })

  describe('_.has(obj: UniversalityObject, key: string): boolean', function () {
    const obj: { [key: string]: any } = {
      a: 0,
      b: true,
      c: ['array']
    }

    Object.keys(obj).forEach(function (key: string) {
      it(`_.has(${JSON.stringify(obj)}, ${key}) should return true`, function () {
        ok(_.has(obj, key))
      })
    })

    it(`_.has(${JSON.stringify(obj)}, 'd') should return false`, function () {
      ok(!_.has(obj, 'd'))
    })
  })

  describe('_.escapeHTML(s:tring): string', function () {
    const cases: [string, string][] = [
      ['a', 'a'],
      ['a&', 'a&amp;'],
      ['&a&', '&amp;a&amp;'],

      ['a&', 'a&amp;'],
      ['&a&', '&amp;a&amp;'],

      ['a<', 'a&lt;'],
      ['<a<', '&lt;a&lt;'],

      ['a>', 'a&gt;'],
      ['>a>', '&gt;a&gt;'],

      ['a&', 'a&amp;'],
      ['&a&', '&amp;a&amp;'],

      ['a"', 'a&quot;'],
      ['"a"', '&quot;a&quot;'],

      ['a\'', 'a&#039;'],
      ['\'a\'', '&#039;a&#039;']
    ]

    cases.forEach(function ([input, output]) {
      it(`_.escapeHTML('${input}') should return '${output}'`, function () {
        equal(_.escapeHTML(input), output)
      })
    })
  })
})
