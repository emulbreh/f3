import {F3Error} from './errors';
import {Component} from './components';
import {sprintf} from 'sprintf';

export class AdapterError extends F3Error {

}

export function toString(value) {
    return '' + value;
}

export function toRenderer(r) {
    if (typeof(r) == 'string') {
        return (o) => sprintf(r, o);
    }
    if (r instanceof Function) {
        return r
    }
    throw new AdapterError(`Cannot adapt ${r} to renderer`);
}

export function toComponentFactory(f, args) {
    if (args) {
        f = toComponentFactory(f);
        return (config) => f({...args, ...config});
    }
    if (Array.isArray(f)){
        return toComponentFactory.apply(null, f);
    }
    if (f.prototype instanceof Component) {
        return (config) => new f(config);
    }
    if (f instanceof Function) {
        return f;
    }
    throw new AdapterError(`Cannot adapt ${f} to component factory`);
}
