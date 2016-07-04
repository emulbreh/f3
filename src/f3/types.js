import {ComponentFactory} from './componentFactories';
import {TextInput, Checkbox} from './inputs';
import {adapt} from './adapters';


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
