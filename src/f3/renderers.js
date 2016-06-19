import {__adapt__} from './adapters';
import {sprintf} from 'sprintf';


export class Renderer {
    constructor(func) {
        this.func = func;
    }

    render(...args) {
        return this.func(...args);
    }

    static [__adapt__](obj) {
        if (typeof(obj) == 'string') {
            return new Renderer(sprintf.bind(null, obj));
        }
        if (obj instanceof Function) {
            return new Renderer(obj);
        }
    }
}
