/**
 * Created by asd on 17-11-13.
 */

import {
  InheritConstructor, UniversalityConstructor, UniversalityFunction, UniversalityObject, Throttled
} from './interfaces'

import Base from './base'
import { encode as Base64Encode } from './base64'
import Browser from './browser'
import { compressUrlQuery, decompressUrlQuery } from './compress'
import * as cookie from './cookie'
import { query, register, EventRegister, querySelectorAll } from './dom'
import { JSONDecode, JSONEncode } from './json'
import * as localStorage from './localStorage'
import * as Logger from './logger'
import * as Type from './type-checker'
import { encode as UTF8Encode } from './utf8'
import { uuid, short } from './uuid'

export default {
  // base
  ...Base,

  // base64
  base64Encode: Base64Encode,

  // Browser
  info: Browser,

  // compress
  compressUrlQuery,
  decompressUrlQuery,

  // cookie
  cookie,

  // dom
  register_event: register,
  dom_query: query,
  querySelectorAll,

  // json
  JSONEncode,
  JSONDecode,

  // localStorage
  localStorage,

  // logger
  ...Logger,

  // type checker
  ...Type,

  // encode
  utf8Encode: UTF8Encode,

  // uuid
  UUID: uuid,
  shortUUID: short
}