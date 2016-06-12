import {Component, Container} from './components';


export class Input extends Component {
    constructor({name, value=null, ...config}={}) {
        super(config);
        this.name = name;
    }

    set value(val) {
    }

    get value() {

    }
}

export class RawInput extends Input {
    constructor({inputType='text', ...config}={}) {
        super(config);
        this.inputElement = document.createElement('input');
        this.inputElement.type = inputType;
        this.element.appendChild(this.inputElement);
    }

    set value(val) {
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

    set value(val) {
        this.inputElement.checked = !!val;
    }

    get value() {
        return this.inputElement.checked;
    }
}


export class Form extends Container(Input) {
    get value() {
        let obj = {};
        for (let input of this.findClosestDecendants((c) => c instanceof Input)) {
            console.log("val", input, input.name, input.value);
            obj[input.name] = input.value;
        }
        return obj;
    }
}
