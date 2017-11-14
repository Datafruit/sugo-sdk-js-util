export interface UniversalityFunction {
  (...args: any[]): any
}

export interface UniversalityObject {
  [key: string]: any
}

export interface UniversalityConstructor {
  new (...args: any[]): any
}

export interface InheritConstructor extends UniversalityConstructor {
  varructor: UniversalityConstructor
  superclass: UniversalityConstructor
}

export interface Throttled {
  (...args: any[]): any
  cancel(): any
}
