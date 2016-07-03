import {Component, Container, Display} from './components';
import {List} from './lists';
import {adapt, toString} from './adapters';
import {Signal, HtmlSignal} from './signals';
import {Renderer} from './renderers';
import {Label} from './labels';


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

    getValue() {
        return this._value;
    }

    set value(val) {
        this.setValue(val);
    }

    get value() {
        return this.getValue();
    }

}


export class RawInput extends Input {
    constructor({inputType='text', inputTagName='input', focusable=true, placeholder='', ...config}={}) {
        super({...config, focusable: false});

        this.inputElement = document.createElement(inputTagName);
        if (inputType) {
            this.inputElement.type = inputType;
        }
        this.inputElement.placeholder = placeholder;
        this.element.appendChild(this.inputElement);

        this.focusable = focusable;
        this.focusElement = this.inputElement;

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

    getValue() {
        return this.inputElement.value;
    }

    click(el=null) {
        super.click(el || this.inputElement);
    }
}


export class TextInput extends RawInput {
    constructor({...config}={}) {
        super(config);
        this.inputElement.addEventListener('keypress', (e) => {
            this.setValue(this.inputElement.value);
        });
    }

    getValue() {
        return this._value;
    }
}

export class TextArea extends RawInput {
    constructor({...config}) {
        super({
            inputTagName: 'textarea',
            inputType: null,
            ...config
        });
    }
}


export class IntegerInput extends TextInput {
    getValue() {
        return parseInt(super.getValue(), 10);
    }
}


export class Checkbox extends RawInput {
    constructor(config={}) {
        super({inputType: 'checkbox', ...config});
    }

    setValue(val) {
        this.inputElement.checked = !!val;
    }

    getValue() {
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
        this.dropdown.itemSelected.then((e) => {
            this.value = e.item;
            this.close();
        });
    }

    open() {
        this.dropdown.show();
    }

    close() {
        this.dropdown.hide();
        this.dropdown.cursorIndex = -1;
    }
}


export class SelectBox extends ChoiceInput {
    constructor({itemFactory, renderer=toString, ...config}={}) {
        super({itemFactory: itemFactory || adapt(Renderer, renderer), ...config});
        this.choiceDisplay = this.addComponent(new Display({
            renderer: renderer,
            focusable: true,
            keymap: this.dropdown.cursorKeymap
        }));
        this.choiceDisplay.clicked.then((e) => {
            this.open();
        });
        this.choiceDisplay.installKeymap({
            'space': () => {this.open();},
            'escape': () => {this.close();}
        });
        this.focusElement = this.choiceDisplay.element;
    }

    setValue(val) {
        super.setValue(val);
        this.choiceDisplay.model = val;
    }
}


export class ComboBox extends ChoiceInput {
    constructor({itemFactory, renderer=toString, ...config}={}) {
        super({itemFactory: itemFactory || adapt(Renderer, renderer), ...config});
        this.renderer = adapt(Renderer, renderer);
        this.textInput = this.addComponent(new TextInput({
            keymap: this.dropdown.cursorKeymap
        }));
        this.textInput.valueChanged.then(() => {
            //this.open();
            //this.model.filter(this.textInput.value);
        });
        this._closeTimeout = null;
        this.textInput.focused.then(() => {
            clearTimeout(this._closeTimeout);
            this.open();
        });
        this.textInput.blurred.then(() => {
            this._closeTimeout = setTimeout(this.close.bind(this), 100);
        });
    }

    setValue(val) {
        super.setValue(val);
        this.textInput.value = this.renderer.render(val);
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


export class Field extends Container(Component) {
    constructor({label='', input, ...config}={}) {
        super(config);
        this.addClass(input.constructor.name + 'Field');
        this.label = adapt(Label, label);
        this.labelComponent = this.addComponent(this.label.create());
        this.input = this.addComponent(input);
        this.labelComponent.clicked.then((ctx) => {
            this.input.click();
            this.input.focus();
        });
    }
}
