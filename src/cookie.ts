// _.cookie
// Methods partially borrowed from quirksmode.org/js/cookies.html
import { JSONDecode } from './json'

export function get(name: string): string | null {
  const nameEQ: string = name + '='
  const ca: string[] = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c: string = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  }
  return null
}

export function parse(name: string): any {
  let cookie: any
  try {
    cookie = JSONDecode(get(name)) || {}
  } catch (err) {
    // noop
  }
  return cookie
}

export function set_seconds(
  name: string,
  value: string,
  seconds: number,
  cross_subdomain?: boolean,
  is_secure?: boolean): void {
  let
    cdomain = '',
    expires = '',
    secure = ''

  if (cross_subdomain) {
    let
      matches: RegExpMatchArray = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
      domain: string = matches ? matches[0] : ''

    cdomain = ((domain) ? '; domain=.' + domain : '')
  }

  if (seconds) {
    let date = new Date()
    date.setTime(date.getTime() + (seconds * 1000))
    // expires = '; expires=' + date.toGMTString()
    expires = '; expires=' + date.toUTCString()
  }

  if (is_secure) {
    secure = '; secure'
  }

  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure
}

export function set(
  name: string,
  value: string,
  days: number,
  cross_subdomain?: boolean,
  is_secure?: boolean): string {
  let cdomain = '', expires = '', secure = ''

  if (cross_subdomain) {
    let matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
      domain = matches ? matches[0] : ''

    cdomain = ((domain) ? '; domain=.' + domain : '')
  }

  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }

  if (is_secure) {
    secure = '; secure'
  }

  var new_cookie_val: string = name
    + '='
    + encodeURIComponent(value)
    + expires
    + '; path=/'
    + cdomain
    + secure

  document.cookie = new_cookie_val
  return new_cookie_val
}

export function remove(name: string, cross_subdomain?: boolean): void {
  set(name, '', -1, cross_subdomain)
}