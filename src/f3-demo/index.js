import * as f3 from 'f3';

import './assets/demo.scss';

let container = new f3.Panel();
let form = new f3.Form({
    children: [
        new f3.Component(),
        new f3.Component(),
        new f3.TextInput({name: 'a'}),
        new f3.TextInput({name: 'b'}),
        new f3.Checkbox({name: 'c'}),
        new f3.Form({
            name: "foo",
            children: [
                new f3.TextInput({name: 'nested'})
            ]
        })
    ]
});

var list;
container.addComponent(form);
container.addComponent(new f3.List({
    itemFactory: [f3.Display, {
        renderer: '%.1f'
    }],
    model: list = new f3.ListModel({
        items: [1.111, 2.222],
    })
}));

list.append(3.333);
list.append(4.444);
list.append(5.555);
list.removeAt(1);
list.reverse();
window.list = list;

//container.removeComponent(c);
//container.removeComponent(c);

console.log(form.value);
let xx = {a: 1};
let yy = {b: 2, a: 2};
console.log({...xx, ...yy}, xx, yy);

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
console.log("xx", f, f.foo);
f.foo = 42;
f.on('PropertyChanged', (e) => console.log(e));
f.foo = 55;
f.bar = 1;
console.log("xx", f.foo);
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
