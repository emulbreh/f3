import {Component, Container, Display} from './components';
import {List} from './lists';
import {toString, toComponentFactory, toRenderer} from './adapters'
import {Signal, HtmlSignal} from './signals';


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
        this.blurred = new HtmlSignal({
            type: 'blur',
            component: this,
            element: this.inputElement
        });
        this.focused = new HtmlSignal({
            type: 'focus',
            component: this,
            element: this.inputElement
        });
    }

    setValue(val) {
        super.setValue(val)
        this.inputElement.value = val;
    }

    get value() {
        return this.inputElement.value;
    }

}


export class TextInput extends RawInput {
    constructor({...config}={}) {
        super(config);
        this.inputElement.addEventListener('keypress', (e) => {
            this.setValue(this.inputElement.value);
        });
    }

    get value() {
        return this._value;
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

export class ChoiceInput extends Container(Input) {
    constructor({itemFactory, model, ...config}={}) {
        super(config);
        this._value = null;
        this.dropdown = this.addComponent(new List({
            itemFactory: itemFactory,
            model: model
        }));
        this.dropdown.hide();
        this.dropdown.itemClicked.then((e) => {
            this.value = e.item;
            this.close();
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


export class SelectBox extends ChoiceInput {
    constructor({itemFactory, renderer=toString, ...config}={}) {
        super({itemFactory: itemFactory || toRenderer(renderer), ...config});
        this.choiceDisplay = this.addComponent(new Display({
            renderer: renderer
        }));
        this.choiceDisplay.clicked.then((e) => {
            this.open();
        });
    }
}


export class ComboBox extends ChoiceInput {
    constructor({itemFactory=toRenderer(toString), ...config}={}) {
        super({itemFactory: itemFactory, ...config});
        this.textInput = this.addComponent(new TextInput({

        }));
        this.textInput.valueChanged.then(() => {
            this.open();
            //this.model.filter(this.textInput.value);
        });
        this.textInput.blurred.then(() => {
            this.close();
        });
    }
}


export class Form extends Container(Input) {
    get value() {
        let obj = {};
        for (let input of this.findClosestDecendants((c) => c instanceof Input)) {
            obj[input.name] = input.value;
        }
        return obj;
    }
}
