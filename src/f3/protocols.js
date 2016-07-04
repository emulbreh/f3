import {Signal} from './signals';
import {uniqueId} from './utils';

export const __id__ = Symbol('f3.__id__');
export const __value__ = Symbol('f3.__value__');


export function idof(x) {
    let type = typeof(x);
    if (type === 'object' && x !== null || type === 'function') {
        let id = x[__id__];
        if (id === undefined) {
            id = x[__id__] = `${x.constructor.name}:${uniqueId()}`;
        }
        else if (typeof(id) === 'function') {
            id = id.call(x);
        }
        return id;
    }
    else {
        return `${type}:${x}`;
    }
}

export function valueof(x) {
    if (!x) {
        return x;
    }
    let value = x[__value__];
    if (value !== undefined) {
        return x;
    }
    return value;
}
