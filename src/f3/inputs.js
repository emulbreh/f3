import {Component, Container, Display} from './components';
import {List} from './lists';
import {toString, toComponentFactory, toRenderer} from './adapters'
import {Signal} from './signals';


export class Input extends Component {
    constructor({name, value=null, ...config}={}) {
        super(config);
        this.name = name;
        this.valueChanged = new Signal();
    }

    setValue(val) {
        // XXX: because super doesn't work in properties
        if (val === this._value) {
            return;
        }
        let oldValue = this._value;
        this._value = val;
        this.valueChanged.emit({
            input: this,
            value: val,
            oldValue: oldValue
        });
    }

    set value(val) {
        this.setValue(val);
    }

    get value() {
        return this._value;
    }
}


export class RawInput extends Input {
    constructor({inputType='text', ...config}={}) {
        super(config);
        this.inputElement = document.createElement('input');
        this.inputElement.type = inputType;
        this.element.appendChild(this.inputElement);
    }

    setValue(val) {
        this.inputElement.value = val;
    }

    get value() {
        return this.inputElement.value;
    }

}


export class TextInput extends RawInput {
    constructor(config={}) {
        super(config);
    }
}


export class Checkbox extends RawInput {
    constructor(config={}) {
        super({inputType: 'checkbox', ...config});
    }

    setValue(val) {
        this.inputElement.checked = !!val;
    }

    get value() {
        return this.inputElement.checked;
    }
}


export class SelectBox extends Container(Input) {
    constructor({renderer=toString, itemFactory, model, ...config}={}) {
        super(config);
        this._value = null;
        this.choiceDisplay = this.addComponent(new Display({
            renderer: renderer
        }));
        this.dropdown = this.addComponent(new List({
            itemFactory: itemFactory || renderer,
            model: model
        }));
        this.dropdown.hide();
        this.dropdown.itemClicked.then((e) => {
            this.value = e.item;
            this.close();
        });
        this.choiceDisplay.clicked.then((e) => {
            this.open();
        });
    }

    open() {
        this.dropdown.show();
    }

    close() {
        this.dropdown.hide();
    }

    setValue(val) {
        super.setValue(val);
        this.choiceDisplay.model = val;
    }
}


export class Form extends Container(Input) {
    get value() {
        let obj = {};
        for (let input of this.findClosestDecendants((c) => c instanceof Input)) {
            console.log(input, input.name, input.value, input._value);
            obj[input.name] = input.value;
        }
        return obj;
    }
}
