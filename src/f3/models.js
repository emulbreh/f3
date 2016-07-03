import {Signal} from './signals';
import {constant, uniqueId} from './utils';
import {adapt} from './adapters';
import {Label} from './labels';
import {ComponentFactory} from './componentFactories';
import {TextInput, Checkbox} from './inputs';


export const properties = Symbol('f3.properties');
export const initialized = Symbol('f3.initialized');
export const __id__ = Symbol('f3.__id__')

const modelData = Symbol('f3.modelData');


export function idof(x) {
    let type = typeof(x);
    if (type === 'object' && x !== null || type === 'function') {
        let id = x[__id__];
        if (id === undefined) {
            id = x[__id__] = `${x.constructor.name}:${uniqueId()}`;
        }
        else if (typeof(id) === 'function') {
            id = id.call(x);
        }
        return id;
    }
    else {
        return `${type}:${x}`;
    }
}


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
        return obj[modelData][this.name];
    }

    set(obj, value) {
        let oldValue = obj[modelData][this.name];
        if (oldValue !== value) {
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


export class Type {
    constructor({inputFactory}) {
        this.inputFactory = adapt(ComponentFactory, inputFactory || this.constructor.defaultInputFactory);
    }
}


export class String extends Type {
    static defaultInputFactory = TextInput;

    constructor({regex=null, ...config}={}) {
        super({...config});
        this.regex = regex;
    }

    coerce(value) {
        return '' + value;
    }

    *validate(value) {
        if (typeof(value) !== 'string') {
            yield 'must be of type string'
        }
        if (this.regex && !this.regex.test(value)) {
            yield `must match ${this.regex}`;
        }
    }
}

export class Boolean extends Type {
    static defaultInputFactory = Checkbox;

    constructor({...config}={}) {
        super(config);
    }
}


export class Number extends Type {
    static defaultInputFactory = TextInput;

    constructor({min, max, ...config}={}) {
        super({...config});
        this.min = min;
        this.max = max;
    }

    *validate(value) {
        yield* super.validate(value);
        if (this.min !== undefined && value < this.min) {
            yield `must be bigger than ${this.min}`;
        }
        if (this.max !== undefined && value > this.max) {
            yield `must be smaller than ${this.max}`;
        }
    }
}


export class Float extends Number {
    constructor({...config}) {
        super({...config});
    }

    coerce(value) {
        return parseFloat(value);
    }

}


export class Integer extends Number {
    constructor({...config}) {
        super({...config});
    }

    coerce(value) {
        return parseInt(value, 10);
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
