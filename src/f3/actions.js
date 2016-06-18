import {Signal} from './signals';


export class Action {
    constructor({name, action, shortcut=null}={}) {
        this.name = name;
        this.action = action;
        this.shortcut = shortcut;
        this.performed = new Signal();
    }

    perform(target) {
        this.action(target);
        this.performed.emit({target, action: this});
    }
}
