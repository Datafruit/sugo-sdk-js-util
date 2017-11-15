export interface EventRegister {
    (element: Element, type: string, handler: EventListener, oldSchool?: boolean, useCapture?: boolean): void;
}
export declare const register: EventRegister;
export declare const query: (query: any) => Element[];
export declare function querySelectorAll(selector: string, context?: Element | Document | DocumentFragment): Element[];
