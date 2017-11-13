/**
 * Created by asd on 17-11-13.
 * @description 日志输出类：可设置输出日志层级、配置前缀、颜色
 */

enum LoggerLevel { ERROR, WARN, INFO, LOG, DEBUG }

const LoggerColor = {
  [LoggerLevel.ERROR]: '#ff4949',
  [LoggerLevel.WARN]: '#f7ba2a',
  [LoggerLevel.INFO]: '#50bfff',
  [LoggerLevel.LOG]: '#333',
  [LoggerLevel.DEBUG]: '#6969d7'
}

interface LoggerConsole {
  (...args: any[]): any
}

function $console (...args: any[]) {
  // 兼容旧版ie必须做apply是函数的判断
  const console = window.console
  if (console && console.log && typeof console.log.apply === 'function') {
    console.log.apply(console, args)
  }
}

export class Logger {

  private console: LoggerConsole
  private scope: string
  private level: number
  private color: any

  constructor (scope?: string, level = LoggerLevel.DEBUG, console = $console) {
    this.scope = scope ? (scope + '->') : ''
    this.level = level
    this.console = console
    this.color = { ...LoggerColor }
  }

  /**
   * 产生实例前缀、颜色后，再与args结合
   * @param {LoggerLevel} level
   * @param  {Array<*>} args
   * @return {Array<*>}
   */
  private prefix (level: LoggerLevel, args: any[]): any[] {
    const color = this.color[level]
    if (!color) {
      return args
    }

    let prefix = '%c' + (this.scope || '') + '[' + level + ']%c: '
    let first = args[0]
    if (typeof first === 'string') {
      prefix = prefix + first
      args = args.slice(1)
    }

    return [
      prefix,
      'color:' + color + ';font-weight:bold;',
      'color:' + this.color[LoggerLevel.LOG]
    ].concat(args)
  }

  private wrapper (level: LoggerLevel, args: any[]): this {
    if (this.level < level) {
      return this
    }
    this.console.apply(this, this.prefix(level, args))
    return this
  }

  public setLevel (level: LoggerLevel): this {
    this.level = level
    return this
  }

  public error (...args: any[]) {
    return this.wrapper(LoggerLevel.ERROR, args)
  }

  public warn (...args: any[]) {
    return this.wrapper(LoggerLevel.WARN, args)
  }

  public info (...args: any[]) {
    return this.wrapper(LoggerLevel.INFO, args)
  }

  public log (...args: any[]) {
    return this.wrapper(LoggerLevel.LOG, args)
  }

  public debug (...args: any[]) {
    return this.wrapper(LoggerLevel.DEBUG, args)
  }
}

export {
  LoggerColor,
  LoggerLevel
}
