import EventEmitter from 'wolfy87-eventemitter';


export class Action extends EventEmitter {
    constructor({name, action}={}) {
        super();
        this.name = name;
        this.action = action;
    }

    perform(target) {
        this.action(target);
        this.emit('Performed', {target, action: this});
    }
}
