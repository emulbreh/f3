import {Display} from './components';
import {AdapterError, __adapt__, adapt} from './adapters';
import {ComponentFactory} from './componentFactories';
import {CONFIG} from './config';


export class Label extends ComponentFactory{
    constructor({text='', icon='', ...config}) {
        super(null);
        this.text = text;
        this.icon = icon;
        this.config = config;
        this.factory = adapt(ComponentFactory, this);
    }

    static [__adapt__](obj) {
        if (typeof(obj) === 'string') {
            return new this({text: obj});
        }
    }

    get html() {
        let h = '';
        if (this.icon) {
            h += `<i class="fa fa-${this.icon}"></i>`;
        }
        if (this.text) {
            h += `<span>${this.text}</span>`;
        }
        return h;
    }

    create(config) {
        return new CONFIG.defaultDisplayComponent({
            model: this.html,
            className: 'label',
            ...this.config,
            ...config
        });
    }
}


export const defaultLabels = {
    ok: new Label({text: 'Ok', icon: 'check'}),
    cancel: new Label({text: 'Cancel', icon: 'close'}),
    close: new Label({icon: 'close'})
};
