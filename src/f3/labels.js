import {Display} from './components';
import {AdapterError, __adapt__} from './adapters';


export class Label {
    constructor({text: '', icon: ''}) {
        this.text = text;
        this.icon = icon;
    }

    static [__adapt__](obj) {
        if (typeof(obj) == 'string') {
            return new this({text: });
        }
    }

    stamp() {
        let icon = this.icon ? `<i class="fa ${this.icon}"></i>`;
        return new Display(icon + this.text);
    }
}
