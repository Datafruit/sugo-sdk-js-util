/**
 * Browser information
 */

import Base from './base'
import { isBrowser } from './type-checker'
import * as UAParser from 'ua-parser-js'
import { UniversalityObject } from './interfaces'

let win: any
if (!isBrowser()) {
  win = {
    navigator: {}
  }
} else {
  win = window
}

const
  navigator = win.navigator,
  document = win.document,
  userAgent = navigator.userAgent

const Info = {
  campaignParams: function (): any {
    const campaign_keywords: string[] = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' ')
    const params: any = {}
    let kw = ''

    Base.each(campaign_keywords, function (kwkey) {
      kw = Base.getQueryParam(document.URL, kwkey)
      if (kw.length) {
        params[kwkey] = kw
      }
    })

    return params
  },

  searchEngine: function (referrer: string): string | null {
    if (referrer.search('https?://(.*)google.([^/?]*)') === 0) {
      return 'google'
    } else if (referrer.search('https?://(.*)bing.com') === 0) {
      return 'bing'
    } else if (referrer.search('https?://(.*)yahoo.com') === 0) {
      return 'yahoo'
    } else if (referrer.search('https?://(.*)duckduckgo.com') === 0) {
      return 'duckduckgo'
    } else {
      return null
    }
  },

  searchInfo: function (referrer: string): any {
    let
      search = Info.searchEngine(referrer),
      param: string = (search !== 'yahoo') ? 'q' : 'p',
      ret: any = {}

    if (search !== null) {
      ret['search_engine'] = search

      let keyword = Base.getQueryParam(referrer, param)
      if (keyword.length) {
        ret['sg_keyword'] = keyword
      }
    }

    return ret
  },

  /**
   * This function detects which browser is running this script.
   * The order of the checks are important since many user agents
   * include key words used in later checks.
   */
  browser: function (user_agent: string, vendor: string, opera: boolean): string {
    vendor = vendor || '' // vendor is undefined for at least IE9
    if (opera || Base.includes(user_agent, ' OPR/')) {
      if (Base.includes(user_agent, 'Mini')) {
        return 'Opera Mini'
      }
      return 'Opera'
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
      return 'BlackBerry'
    } else if (Base.includes(user_agent, 'IEMobile') || Base.includes(user_agent, 'WPDesktop')) {
      return 'Internet Explorer Mobile'
    } else if (Base.includes(user_agent, 'Edge')) {
      return 'Microsoft Edge'
    } else if (Base.includes(user_agent, 'FBIOS')) {
      return 'Facebook Mobile'
    } else if (Base.includes(user_agent, 'Chrome')) {
      return 'Chrome'
    } else if (Base.includes(user_agent, 'CriOS')) {
      return 'Chrome iOS'
    } else if (Base.includes(user_agent, 'UCWEB') || Base.includes(user_agent, 'UCBrowser')) {
      return 'UC Browser'
    } else if (Base.includes(user_agent, 'FxiOS')) {
      return 'Firefox iOS'
    } else if (Base.includes(vendor, 'Apple')) {
      if (Base.includes(user_agent, 'Mobile')) {
        return 'Mobile Safari'
      }
      return 'Safari'
    } else if (Base.includes(user_agent, 'Android')) {
      return 'Android Mobile'
    } else if (Base.includes(user_agent, 'Konqueror')) {
      return 'Konqueror'
    } else if (Base.includes(user_agent, 'Firefox')) {
      return 'Firefox'
    } else if (Base.includes(user_agent, 'MSIE') || Base.includes(user_agent, 'Trident/')) {
      return 'Internet Explorer'
    } else if (Base.includes(user_agent, 'Gecko')) {
      return 'Mozilla'
    } else {
      return ''
    }
  },

  /**
   * This function detects which browser version is running this script,
   * parsing major and minor version (e.g., 42.1). User agent strings from:
   * http://www.useragentstring.com/pages/useragentstring.php
   */
  browserVersion: function (userAgent: string, vendor: string, opera: boolean): number {
    const browser = Info.browser(userAgent, vendor, opera)
    const versionRegexs: { [key: string]: RegExp } = {
      'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
      'Microsoft Edge': /Edge\/(\d+(\.\d+)?)/,
      'Chrome': /Chrome\/(\d+(\.\d+)?)/,
      'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
      'UC Browser': /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
      'Safari': /Version\/(\d+(\.\d+)?)/,
      'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
      'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
      'Firefox': /Firefox\/(\d+(\.\d+)?)/,
      'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
      'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
      'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
      'Android Mobile': /android\s(\d+(\.\d+)?)/,
      'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
      'Mozilla': /rv:(\d+(\.\d+)?)/
    }
    const regex = versionRegexs[browser]
    if (regex === undefined) {
      return null
    }
    const matches = userAgent.match(regex)
    if (!matches) {
      return null
    }
    return parseFloat(matches[matches.length - 2])
  },

  os: function (): string {
    const a = userAgent
    if (/Windows/i.test(a)) {
      if (/Phone/.test(a) || /WPDesktop/.test(a)) {
        return 'Windows Phone'
      }
      return 'Windows'
    } else if (/(iPhone|iPad|iPod)/.test(a)) {
      return 'iOS'
    } else if (/Android/.test(a)) {
      return 'Android'
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
      return 'BlackBerry'
    } else if (/Mac/i.test(a)) {
      return 'Mac OS X'
    } else if (/Linux/.test(a)) {
      return 'Linux'
    } else {
      return ''
    }
  },

  device: function (user_agent: string): string {
    if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
      return 'Windows Phone'
    } else if (/iPad/.test(user_agent)) {
      return 'iPad'
    } else if (/iPod/.test(user_agent)) {
      return 'iPod Touch'
    } else if (/iPhone/.test(user_agent)) {
      return 'iPhone'
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
      return 'BlackBerry'
    } else if (/Android/.test(user_agent)) {
      return 'Android'
    } else {
      return ''
    }
  },

  referringDomain: function (referrer: string): string {
    const split: string[] = referrer.split('/')
    if (split.length >= 3) {
      return split[2]
    }
    return ''
  },

  environment: function (): any {
    return new UAParser()
  },

  properties: function (): UniversalityObject {
    const env: any = Info.environment()

    return Base.extend(Base.strip_empty_properties({
      'system_version': env.os.version,
      'system_name': env.os.name,
      'browser': env.browser.name,
      'referring_domain': Info.referringDomain(document.referrer),
      'device_model': env.device.model
    }), {
        'event_time': Base.timestamp(),// client date
        'current_url': window.location.href,
        'browser_version': env.browser.major,
        'screen_height': screen.height,
        'screen_width': screen.width,
        'sugo_lib': 'web',
        // TODO LIB_VERSION
        // 'sdk_version': Config.LIB_VERSION
      })
  },

  people_properties: function (): UniversalityObject {
    const _window: any = window
    return Base.extend(Base.strip_empty_properties({
      'system_name': Info.os(),
      'browser': Info.browser(userAgent, navigator.vendor, _window.opera),
      'browser_version': Info.browserVersion(userAgent, navigator.vendor, _window.opera)
    }))
  },

  pageviewInfo: function (page: string): UniversalityObject {
    const _window: any = window
    return Base.strip_empty_properties({
      'event_type': 'pageloading',
      'event_time': Base.timestamp(),// client date
      'device_agent': Info.os(),
      'path_name': page,
      'page_name': document.title,
      'current_url': window.location.href,
      'browser': Info.browser(userAgent, navigator.vendor, _window.opera),
      'browser_version': Info.browserVersion(userAgent, navigator.vendor, _window.opera)
    })
  }
}

export default Info