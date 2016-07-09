import {Button} from './buttons.js';
import {Container} from './components.js';
import {defaultLabels} from './labels.js';
import {List} from './lists.js';
import {makeModelForm} from './modelForms.js';


export class FormSet extends Container() {
    constructor({cls, model, ...config}={}) {
        super(config);
        this.model = model;
        this.forms = this.addComponent(new List({
            itemFactory: ({model}) => {
                return makeModelForm(cls, {
                    model: model
                });
            },
            model: model
        }));
        this.addButton = this.addComponent(new Button({
            label: defaultLabels.add,
            action: () => {
                this.model.append(new cls());
            }
        }));
    }
}
