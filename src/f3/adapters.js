import {F3Error} from './errors';


export const __adapt__ = Symbol('f3.adapt');
const nativeAdapters = new Map();


export class AdapterError extends F3Error{

}


export function adapt(cls, obj, ...ctx) {
    if (obj instanceof cls) {
        return obj;
    }
    let adapt = nativeAdapters[cls] || cls[__adapt__];
    let value = adapt.call(cls, obj, ...ctx);
    if (typeof(value) == 'undefined') {
        throw new AdapterError(`Cannot adapt ${obj} to ${cls}`);
    }
    return value;
}


export function toString(value) {
    return '' + value;
}

nativeAdapters[String] = toString;
