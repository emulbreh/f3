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

    }
}

export function makeModelForm(cls, config={}) {
    let fields = [];
    for (let property of cls.properties) {
        fields.push(new Field({
            name: property.name,
            label: property.label,
            input: property.inputFactory.create()
        }));
    }
    return new ModelForm({
        children: fields,
        model: new cls(),
        ...config
    });
}
