import {F3Error} from './errors';
import {Component} from './components';
import {Action} from './actions';
import {CONFIG} from './config';
import {sprintf} from 'sprintf';


export class AdapterError extends F3Error {

}


export function toString(value) {
    return '' + value;
}


export function toAction(component, a) {
    if (a instanceof Action) {
        return a;
    }
    if (a instanceof Function) {
        return new Action({action: a});
    }
    if (typeof(a) == 'string') {
        return toAction(component, () => component.app.router.call(a));
    }
    throw new AdapterError(`Cannot adapt ${a} to action`);
}


export function toRenderer(r) {
    if (typeof(r) == 'string') {
        r = sprintf.bind(null, r);
    }
    else if (!(r instanceof Function)) {
        throw new AdapterError(`Cannot adapt ${r} to renderer`);
    }
    r.__f3_renderer = true;
    return r;

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
    if (f instanceof Function && !f.__f3_renderer) {
        return f;
    }
    try {
        let renderer = toRenderer(f);
        return (config) => {
            return new CONFIG.defaultDisplayComponent({renderer: renderer, ...config});
        };
    }
    catch(e) {
        if (!(e instanceof AdapterError)) {
            throw e;
        }
    }
    throw new AdapterError(`Cannot adapt ${f} to component factory`);
}
