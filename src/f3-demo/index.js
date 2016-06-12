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

let router = new f3.Router();
router.addRoute('/foo/', (params) => console.log('foo', params));
router.addRoute('/foo/{id}/', (params) => console.log('foo', params));
router.call('/foo/');
router.call('/foo/123/');

let app = new f3.Application();
app.setPage(container);
