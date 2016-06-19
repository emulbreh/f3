import {Component} from './components';
import {adapt} from './adapters';
import {Action} from './actions';
import {Label} from './labels';


export class Button extends Component {
    constructor({action, label, ...config}) {
        super({tagName: 'button', ...config});
        this.action = adapt(Action, action, this);
        this._label = null;
        this.label = label;
        this.element.addEventListener('click', (event) => {
            this.action.perform({event});
        });
    }

    get label() {
        return this._label;
    }

    set label(label) {
        this._label = adapt(Label, label);
        this.element.innerHTML = this.label.html;
    }
}
