import {Signal} from './signals';
import {__adapt__} from './adapters';


export class Action {
    constructor({name, action, shortcut=null}={}) {
        this.name = name;
        this.action = action;
        this.shortcut = shortcut;
        this.performed = new Signal();
    }

    static [__adapt__](obj, component) {
        if (obj instanceof Function) {
            return new Action({action: obj});
        }
        if (typeof(obj) == 'string') {
            return new Action({
                action: () => {
                    component.app.router.call(obj);
                }
            });
        }
    }

    perform(target) {
        this.action(target);
        this.performed.emit({target, action: this});
    }
}
