import {Form, Field} from './inputs';


export class ModelForm extends Form {
    constructor({model, ...config}={}) {
        super(config);
        this.model = model;
    }

    get model() {
        return this._model;
    }

    set model(m) {
        this._model = m;
        this.value = m.getData();
        for (let input of this.getInputs()) {
            input.valueChanged.then((e) => {
                m[input.name] = e.value;
            });
        }
        m.propertyChanged.then((e) => {
            this.getInput(e.property.name).value = e.value;
        });
    }
}

export function makeModelForm(cls, config={}) {
    let fields = [];
    for (let property of cls.properties) {
        fields.push(new Field({
            name: property.name,
            label: property.label,
            input: property.inputFactory.create({
                name: property.name
            })
        }));
    }
    return new ModelForm({
        children: fields,
        model: config.model || new cls(),
        ...config
    });
}
