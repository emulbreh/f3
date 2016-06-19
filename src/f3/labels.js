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
        if (typeof(obj) == 'string') {
            return new this({text: obj});
        }
    }

    get html() {
        let icon = this.icon ? `<i class="fa fa-${this.icon}"></i>` : '';
        return icon + this.text;
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
