/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   13/11/2017
 * @description
 */

import 'mocha'
import { ok, equal } from 'assert'
import { Logger, LoggerLevel, LoggerColor } from '../src/logger'

describe('Logger Class Test Case', function () {

  let message: string = null
  let color: string = null

  const Scope = '__TEST__'
  const logger = new Logger(
    Scope,
    LoggerLevel.DEBUG,
    (...args) => {
      message = args[0]
      color = args[1]
    }
  )

  it('Should output prefix if configure in constructor', function () {
    logger.log('log')
    ok(message.indexOf(Scope) > -1)
    message = null
  })

  it('Should invoke console function while log level less than settings by logger.setLevel', function () {
    logger.setLevel(LoggerLevel.ERROR)
    logger.log('log')
    equal(message, null)
    logger.setLevel(LoggerLevel.DEBUG)
  })

  it('Should use error color while called logger.error method', function () {
    logger.error('error')
    ok(color.indexOf(LoggerColor[LoggerLevel.ERROR]) > -1)
  })

  it('Should use warn color while called logger.warn method', function () {
    logger.warn('warn')
    ok(color.indexOf(LoggerColor[LoggerLevel.WARN]) > -1)
  })

  it('Should use info color while called logger.info method', function () {
    logger.info('info')
    ok(color.indexOf(LoggerColor[LoggerLevel.INFO]) > -1)
  })

  it('Should use log color while called logger.log method', function () {
    logger.log('log')
    ok(color.indexOf(LoggerColor[LoggerLevel.LOG]) > -1)
  })

  it('Should use log color while called logger.debug method', function () {
    logger.debug('debug')
    ok(color.indexOf(LoggerColor[LoggerLevel.DEBUG]) > -1)
  })
})


