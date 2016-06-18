import {Signal} from './signals';

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
            obj.propertyChanged.emit({
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


export class Model {
    constructor(config) {
        this[modelData] = {};
        this.constructor.initClass();
        this.propertyChanged = new Signal();
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


export class ListModel{
    constructor({items, ...config}) {
        this.items = items;
        this.itemAdded = new Signal();
        this.itemRemoved = new Signal();
        this.itemsReordered = new Signal();
    }

    onItemAdded(item, index) {
        this.itemAdded.emit({model: this, item, index});
    }

    onItemRemoved(item, index) {
        this.itemRemoved.emit({model: this, item, index});
    }

    onItemsReordered() {
        this.itemsReordered.emit({model: this});
    }

    get(index) {
        return this.items[index];
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
