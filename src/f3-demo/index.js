import * as f3 from 'f3';

import './assets/demo.scss';
import 'mousetrap';

Mousetrap.bind('alt+f', (e) => {console.log("Mousetrap", e);})

let list = new f3.ListModel({
    items: [1.111, 2.222],
});

let selectBox, comboBox;

let container = new f3.Panel();
let form = new f3.Form({
    children: [
        new f3.Component(),
        new f3.Component(),
        new f3.TextInput({name: 'a'}),
        new f3.TextInput({name: 'b'}),
        new f3.Checkbox({name: 'c'}),
        selectBox = new f3.SelectBox({name: 'd', model: list}),
        comboBox = new f3.ComboBox({name: 'e', model: list}),
        new f3.Form({
            name: "foo",
            children: [
                new f3.TextInput({name: 'nested'})
            ]
        })
    ]
});

container.addComponent(form);
container.addComponent(new f3.List({
    itemFactory: [f3.Display, {
        renderer: '%.1f'
    }],
    model: list
}));

list.append(3.333);
list.append(4.444);
list.append(5.555);
list.removeAt(1);
list.reverse();
window.list = list;

class Foo extends f3.Model {
    static properties = [
        new f3.Property('foo')
    ];
}

class Bar extends f3.Model {
    static properties = Foo.properties.concat([
        new f3.Property('bar')
    ]);
}

let f = new Bar({});
f.foo = 42;
f.propertyChanged.then((e) => console.log('PropertyChanged', e));
f.foo = 55;
f.bar = 1;
container.addComponent(new f3.Button({
    label: 'Bar',
    action: '/bar'
}));
container.addComponent(new f3.Button({
    label: 'Foo',
    action: '/foo'
}));
container.addComponent(new f3.Button({
    label: 'Show data',
    action: new f3.Action({
        action: () => {
            console.log(form.value);
        }
    })
}));

let app = new f3.Application();
app.addPage('/', new f3.Page({root: container}));
app.addPage('/foo', new f3.Page({
    root: new f3.Display({model: "foo page"})
}));
app.addPage('/bar', new f3.Page({
    root: new f3.Display({model: "bar page"})
}));
