import EventEmitter from 'wolfy87-eventemitter';


class Action extends EventEmitter {
    constructor({name, action}) {
        this.name = name;
        this.action = action;
    }

    perform(target) {
        this.action(target);
        this.emit('Performed', {target, action: this});
    }
}

new Action({
    name: 'Create Todo',
    action: () => {

    }
})

new Action({
    name: 'Delete Todo',
    perform: (todo) => {
         TodoStore.delete(todo);
    }
})
