import {Display} from './components';


export class Label {
    constructor({text: '', icon: ''}) {
        this.text = text;
        this.icon = icon;
    }

    stamp() {
        let icon = this.icon ? `<i class="fa ${this.icon}"></i>`;
        return new Display(icon + this.text);
    }
}
