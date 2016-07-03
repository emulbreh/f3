import {Container} from './components';
import {adapt} from './adapters';
import {Action} from './actions';
import {Label} from './labels';


export class Button extends Container() {
    constructor({action, label, ...config}) {
        super({tagName: 'button', ...config});
        this.action = action ? adapt(Action, action, this) : null;
        this._label = null;
        this.label = label;
        this.clicked.then((event) => {
            if (this.action) {
                this.action.perform({event});
            }
        });
    }

    get label() {
        return this._label;
    }

    set label(label) {
        if (this.labelComponent) {
            this.removeComponent(this.labelComponent);
        }
        this._label = adapt(Label, label);
        this.labelComponent = this._label.create();
        this.addComponent(this.labelComponent);
    }
}


export class ToggleButton extends Button {
    constructor({toggled=false, ...config}) {
        super(config);
        this.toggled = toggled;
        this.clicked.then(this.toggle.bind(this));
    }

    set toggled(value) {
        this._toggled = value;
        if (value) {
            this.addClass('toggled');
        }
        else{
            this.removeClass('toggled');
        }
    }

    get toggled() {
        return this._toggled;
    }

    toggle() {
        this.toggled = !this.toggled;

    }
}
