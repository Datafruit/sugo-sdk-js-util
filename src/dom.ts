/**
 * DOM utils
 */

import { Logger, LoggerLevel } from './logger'
import * as Type from './type-checker'
import * as Sizzle from 'sizzle'

const logger = new Logger('DOM').setLevel(LoggerLevel.ERROR)

export interface EventRegister {
  (
    element: Element,
    type: string,
    handler: EventListener,
    oldSchool?: boolean,
    useCapture?: boolean
  ): void
}

export const register: EventRegister = (function () {
  // written by Dean Edwards, 2005
  // with input from Tino Zijdel - crisp@xs4all.nl
  // with input from Carl Sverre - mail@carlsverre.com
  // with input from Mixpanel
  // http://dean.edwards.name/weblog/2005/10/add-event/
  // https://gist.github.com/1930440

  const register_event: EventRegister = function (
    element: Element,
    type: string,
    handler: EventListener,
    oldSchool?: boolean,
    useCapture?: boolean
  ): void {
    if (!element) {
      logger.error('No valid element provided to register_event')
      return
    }

    if (element.addEventListener && !oldSchool) {
      element.addEventListener(type, handler, !!useCapture)
    } else {
      let proxy: any = element
      let ontype = 'on' + type
      let old_handler = <EventListener | undefined>proxy[ontype] // can be undefined
      proxy[ontype] = makeHandler(element, handler, old_handler)
    }
  }

  function makeHandler(
    element: Element,
    new_handler: EventListener,
    old_handlers?: EventListener): EventListener {

    const handler: EventListener = function (event: Event) {
      event = event || fixEvent(window.event)

      // this basically happens in firefox whenever another script
      // overwrites the onload callback and doesn't pass the event
      // object to previously defined callbacks.  All the browsers
      // that don't define window.event implement addEventListener
      // so the dom_loaded handler will still be fired as usual.
      if (!event) {
        return undefined
      }

      let ret = true
      let old_result: any, new_result: any

      if (typeof old_handlers === 'function') {
        old_result = old_handlers(event)
      }
      new_result = new_handler.call(element, event)

      if ((false === old_result) || (false === new_result)) {
        ret = false
      }

      return ret
    }

    return handler
  }

  const fixEvent: any = function (event: Event) {
    if (event) {
      event.preventDefault = fixEvent.preventDefault
      event.stopPropagation = fixEvent.stopPropagation
    }
    return event
  }

  fixEvent.preventDefault = function () {
    this.returnValue = false
  }
  fixEvent.stopPropagation = function () {
    this.cancelBubble = true
  }

  return register_event
})()

export const query = (function () {
  /* document.getElementsBySelector(selector)
   - returns an array of element objects from the current document
   matching the CSS selector. Selectors can contain element names,
   class names and ids and can be nested. For example:

   elements = document.getElementsBySelector('div#main p a.external')

   Will return an array of all 'a' elements with 'external' in their
   class attribute that are contained inside 'p' elements that are
   contained inside the 'div' element which has id="main"

   New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
   See http://www.w3.org/TR/css3-selectors/#attribute-selectors

   Version 0.4 - Simon Willison, March 25th 2003
   -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
   -- Opera 7 fails

   Version 0.5 - Carl Sverre, Jan 7th 2013
   -- Now uses jQuery-esque `hasClass` for testing class name
   equality.  This fixes a bug related to '-' characters being
   considered not part of a 'word' in regex.
   */

  function getAllChildren(e: any): NodeListOf<Element> {
    // Returns all children of element. Workaround required for IE5/Windows. Ugh.
    return e.all ? e.all : e.getElementsByTagName('*')
  }

  const bad_whitespace = /[\t\r\n]/g

  function hasClass(elem: Element, selector: string) {
    const className = ' ' + selector + ' '
    return ((' ' + elem.className + ' ').replace(bad_whitespace, ' ').indexOf(className) >= 0)
  }

  function getElementsBySelector(selector: string): Element[] {
    // Attempt to fail gracefully in lesser browsers
    if (!document.getElementsByTagName) {
      return []
    }
    // Split selector in to tokens
    const tokens: string[] = selector.split(' ')
    let
      token: string,
      bits: string[],
      tagName: string,
      found: Element[],
      foundCount: number,
      i: number, j: number, k: number,
      elements: NodeListOf<Element>,
      currentContextIndex: number

    let currentContext: any[] = [document]

    for (i = 0; i < tokens.length; i++) {
      token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '')
      if (token.indexOf('#') > -1) {
        // Token is an ID selector
        bits = token.split('#')
        tagName = bits[0]
        var id = bits[1]
        var element = document.getElementById(id)
        if (!element || (tagName && element.nodeName.toLowerCase() != tagName)) {
          // element not found or tag with that ID not found, return false
          return []
        }
        // Set currentContext to contain just this element
        currentContext = [element]
        continue // Skip to next token
      }
      if (token.indexOf('.') > -1) {
        // Token contains a class selector
        bits = token.split('.')
        tagName = bits[0]
        var className = bits[1]
        if (!tagName) {
          tagName = '*'
        }
        // Get elements matching tag, filter them for class selector
        found = []
        foundCount = 0
        for (j = 0; j < currentContext.length; j++) {
          if (tagName == '*') {
            elements = getAllChildren(currentContext[j])
          } else {
            elements = currentContext[j].getElementsByTagName(tagName)
          }
          for (k = 0; k < elements.length; k++) {
            found[foundCount++] = elements[k]
          }
        }
        currentContext = []
        currentContextIndex = 0
        for (j = 0; j < found.length; j++) {
          if (found[j].className &&
            Type.isString(found[j].className) && // some SVG elements have classNames which are not strings
            hasClass(found[j], className)
          ) {
            currentContext[currentContextIndex++] = found[j]
          }
        }
        continue // Skip to next token
      }
      // Code to deal with attribute selectors
      var token_match = token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)
      if (token_match) {
        tagName = token_match[1]
        var attrName = token_match[2]
        var attrOperator = token_match[3]
        var attrValue = token_match[4]
        if (!tagName) {
          tagName = '*'
        }
        // Grab all of the tagName elements within current context
        found = []
        foundCount = 0
        for (j = 0; j < currentContext.length; j++) {
          if (tagName == '*') {
            elements = getAllChildren(currentContext[j])
          } else {
            elements = currentContext[j].getElementsByTagName(tagName)
          }
          for (k = 0; k < elements.length; k++) {
            found[foundCount++] = elements[k]
          }
        }
        currentContext = []
        currentContextIndex = 0
        var checkFunction // This function will be used to filter the elements
        switch (attrOperator) {
          case '=': // Equality
            checkFunction = function (e: Element) {
              return (e.getAttribute(attrName) == attrValue)
            }
            break
          case '~': // Match one of space seperated words
            checkFunction = function (e: Element) {
              return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b')))
            }
            break
          case '|': // Match start with value followed by optional hyphen
            checkFunction = function (e: Element) {
              return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')))
            }
            break
          case '^': // Match starts with value
            checkFunction = function (e: Element) {
              return (e.getAttribute(attrName).indexOf(attrValue) === 0)
            }
            break
          case '$': // Match ends with value - fails with "Warning" in Opera 7
            checkFunction = function (e: Element) {
              return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length)
            }
            break
          case '*': // Match ends with value
            checkFunction = function (e: Element) {
              return (e.getAttribute(attrName).indexOf(attrValue) > -1)
            }
            break
          default:
            // Just test for existence of attribute
            checkFunction = function (e: Element) {
              return e.getAttribute(attrName)
            }
        }
        currentContext = []
        currentContextIndex = 0
        for (j = 0; j < found.length; j++) {
          if (checkFunction(found[j])) {
            currentContext[currentContextIndex++] = found[j]
          }
        }
        // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
        continue // Skip to next token
      }
      // If we get here, token is JUST an element (not a class or ID selector)
      tagName = token
      found = []
      foundCount = 0
      for (j = 0; j < currentContext.length; j++) {
        elements = currentContext[j].getElementsByTagName(tagName)
        for (k = 0; k < elements.length; k++) {
          found[foundCount++] = elements[k]
        }
      }
      currentContext = found
    }
    return currentContext
  }

  return function (query: any): Element[] {
    if (Type.isElement(query)) {
      return <Element[]>[query]
    } else if (Type.isObject(query) && !Type.isUndefined(query.length)) {
      return <Element[]>query
    } else {
      return getElementsBySelector.call(this, query)
    }
  }
})()

export function querySelectorAll(selector: string, context?: Element | Document | DocumentFragment): Element[] {
  return Sizzle(selector, context)
}

