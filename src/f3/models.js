import {Signal} from './signals';
import {constant} from './utils';
import {adapt} from './adapters';
import {Label} from './labels';
import {ComponentFactory} from './componentFactories';
import {__value__} from './protocols';


const initialized = Symbol('f3.initialized');
const __data__ = Symbol('f3.__data__');
const __properties__ = Symbol('f3.__properties__')


export class Property {
    constructor(name, {inputFactory=null, type=null, label=null, validator=constant(true), choices=null, ...config}={}) {
        this.name = name;
        this.type = type;
        this.label = adapt(Label, label || name);
        this.choices = choices;
        this.validator = validator;
        this._inputFactory = inputFactory ? adapt(ComponentFactory, inputFactory) : null;
    }

    get inputFactory() {
        return this._inputFactory || this.type.inputFactory;
    }

    get(obj) {
        return obj[__data__][this.name];
    }

    set(obj, value) {
        let oldValue = obj[__data__][this.name];
        if (oldValue !== value) {
            obj[__data__][this.name] = value;
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


export function prop(model, name) {
    let property = model.constructor.getProperty(name);
    let changed = new Signal();
    model.propertyChanged.then((e) => {
        if (e.property === property) {
            changed.emit(e);
        }
    });
    return {
        changed,
        get value() {
            return this[__value__];
        },
        get [__value__]() {
            return property.get(model);
        }
    }
}

export class Model {
    constructor(config) {
        this[__data__] = {};
        this.constructor.initClass();
        this.propertyChanged = new Signal();
    }

    static initClass() {
        if (this[initialized]) {
            return;
        }
        let properties = {};
        for (let property of this.properties) {
            property.define(this);
            properties[property.name] = property;
        }
        this[__properties__] = properties;
        this[initialized] = true;
    }

    static getProperty(name) {
        return this[__properties__][name];
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

    get(index) {
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
