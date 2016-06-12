import EventEmitter from 'wolfy87-eventemitter';

export var properties = Symbol('f3.properties');
export var initialized = Symbol('f3.initialized');
const modelData = Symbol('f3.modelData');


export class Property {
    constructor(name) {
        this.name = name;
    }

    get(obj) {
        return obj[modelData][this.name];
    }

    set(obj, value) {
        let oldValue = obj[modelData][this.name];
        if (oldValue != value) {
            obj[modelData][this.name] = value;
            obj.emit('PropertyChanged', {
                model: obj,
                property: this,
                value: value,
                oldValue: oldValue
            });
        }
    }

    define(cls) {
        const self = this;
        Object.defineProperty(cls.prototype, this.name, {
            get: function() {
                return self.get(this);
            },
            set: function(value) {
                self.set(this, value);
            }
        });
    }
}


export class Model extends EventEmitter {
    constructor(config) {
        super();
        this[modelData] = {};
        this.constructor.initClass();
    }

    static initClass() {
        if (this[initialized]) {
            return;
        }
        console.log(`init class ${this}`);
        for (let property of this.properties) {
            property.define(this);
        }
        this[initialized] = true;
    }
}


export class ListModel extends EventEmitter{
    constructor({items, ...config}) {
        super(config);
        this.items = items;
    }

    onItemAdded(item, index) {
        this.emit('ItemAdded', {model: this, item, index});
    }

    onItemRemoved(item, index) {
        this.emit('ItemRemoved', {model: this, item, index});
    }

    onItemsReordered() {
        this.emit('ItemsReordered', {model: this});
    }

    get length() {
        return this.items.length;
    }

    *[Symbol.iterator]() {
        yield* this.items;
    }

    append(item) {
        let index = this.items.length;
        this.items.push(item);
        this.onItemAdded(item, index);
    }

    insert(index, item) {
        this.items.splice(index, 0, item);
        this.onItemAdded(item, index);
    }

    remove(item) {
        let index = this.items.indexOf(item);
        if (index < 0) {
            return;
        }
        this.items.splice(index, 1);
        this.onItemRemoved(item, index);
    }

    removeAt(index) {
        let item = this.items[index];
        this.items.splice(index, 1);
        this.onItemRemoved(item, index);
    }

    pop() {
        this.removeIndex(this.items.length - 1);
    }

    clear() {
        this.items = [];
        for (var i = this.items.length - 1; i >= 0; i--) {
            this.removeIndex(i);
        }
    }

    reverse() {
        this.items.reverse();
        this.onItemsReordered();
    }
}
