/**
 * localStorage
 */
import { Logger } from './logger'
import { JSONDecode } from './json'

const logger = new Logger('localStorage')

export function error(msg: string) {
  logger.error('localStorage error: ' + msg)
}

export function get(name: string): string | null {
  try {
    return window.localStorage.getItem(name)
  } catch (err) {
    error(err)
  }
  return null
}

export function parse(name: string): any | null {
  try {
    return JSONDecode(get(name)) || {}
  } catch (err) {
    logger.error('localStorage.parse.error %s', err.message)
  }
  return null
}

export function set(name: string, value: string): void {
  try {
    window.localStorage.setItem(name, value)
  } catch (err) {
    error(err)
  }
}

export function remove(name: string): void {
  try {
    window.localStorage.removeItem(name)
  } catch (err) {
    error(err)
  }
}
