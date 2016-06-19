import {__adapt__, adapt, AdapterError} from './adapters';
import {Component} from './components';
import {Renderer} from './renderers';
import {CONFIG} from './config';


export class ComponentFactory {
    constructor(func, config={}) {
        this.func = func;
        this.config = config;
    }

    create(config) {
        return this.func({...this.config, ...config});
    }

    static [__adapt__](obj, args) {
        if (Array.isArray(obj)){
            return this[__adapt__].apply(this, obj);
        }
        if (obj.prototype instanceof Component) {
            return new this((config) => new obj(config), args);
        }
        if (obj instanceof Function) {
            return new this(obj, args);
        }
        try {
            let renderer = adapt(Renderer, obj);
            return new this((config) => {
                return new CONFIG.defaultDisplayComponent({
                    renderer: renderer, ...config
                });
            }, args);
        }
        catch(e) {
            if (!(e instanceof AdapterError)) {
                throw e;
            }
        }
    }
}
