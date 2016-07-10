import * as f3 from 'f3';

window.f3 = f3;

import './assets/demo.scss';
import 'mousetrap';

Mousetrap.bind('alt+f', (e) => {console.log("Mousetrap", e);})

let list = new f3.ListModel({
    items: [1.111, 2.222],
});

let selectBox, comboBox;

class Todo extends f3.Model{
    static properties = [
        new f3.Property('title', {inputFactory: f3.TextInput}),
        new f3.Property('description', {inputFactory: f3.TextArea}),
        new f3.Property('done', {type: new f3.Boolean(), label: 'DONE'}),
        new f3.Property('priority', {type: new f3.Integer(), choices: [
            {label: 'low', value: 0},
            {label: 'default', value: 1},
            {label: 'high', value: 3}
        ]})
    ];
}

let todo = new Todo();

let todoList = new f3.ListModel({});

let container = new f3.Panel({children: [
    new f3.Display({
        className: 'menu',
        model: 'Demo'
    }),
    new f3.Display({
        model: '<i class="fa fa-circle-o-notch fa-spin" />'
    }),
    new f3.Panel({
        children: [
            f3.makeModelForm(Todo, {model: todo}),
            f3.makeModelForm(Todo, {model: todo})
        ]
    }),
    new f3.FormSet({
        model: todoList,
        cls: Todo
    }),
    new f3.SelectBox({
        model: todoList,
        renderer: f3.format('{title="–"}')
    }),
    new f3.List({
        model: todoList,
        itemFactory: [f3.Display, {
            renderer: f3.format('<b>#{title!03i=0}</b><br/> {title="–"} {done} {description!r}')
        }]
    })
]});

let form = new f3.Form({
    children: [
        new f3.Field({
            label: 'Field A',
            input: new f3.TextInput({name: 'a'})
        }),
        new f3.Field({
            label: 'Field B',
            input: new f3.TextInput({name: 'b'})
        }),
        new f3.Field({
            label: 'Enable C checkbox option',
            input: new f3.Checkbox({name: 'c'})
        }),
        new f3.Field({
            label: 'Choice',
            input: selectBox = new f3.SelectBox({name: 'd', model: list})
        }),
        comboBox = new f3.ComboBox({name: 'e', model: list}),
        new f3.Field({
            label: new f3.Label({text: 'Input Group', icon: 'object-group'}),
            input: new f3.Form({
                name: "foo",
                children: [
                    new f3.TextInput({
                        name: 'nested',
                        placeholder: 'Foo'
                    }),
                    new f3.TextArea({
                        name: 'nested',
                        placeholder: 'Foo'
                    })
                ]
            })
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
    label: new f3.Label({text: 'Show Data', icon: 'file-code-o'}),
    action: new f3.Action({
        action: () => {
            console.log(form.value);
        }
    })
}));

let app = new f3.Application();

let okButton;
container.addComponents([
    okButton = new f3.Button({label: f3.defaultLabels.ok}),
    new f3.Button({label: f3.defaultLabels.cancel}),
    new f3.ToggleButton({label: 'Toggle Me'})
]);

let testAction = new f3.Action({
    shortcut: 'alt+e',
    action: () => {
        let d = new f3.Dialog({
            app: app,
            title: new f3.Label({text: 'Test Dialog', icon: 'gears'})
        });
        d.open();
    }
});
app.addAction(testAction);

okButton.clicked.then(testAction.trigger);

app.addPage('/', new f3.Page({root: container}));
app.addPage('/foo', new f3.Page({
    root: new f3.Display({model: "foo page"})
}));
app.addPage('/bar', new f3.Page({
    root: new f3.Display({model: "bar page"})
}));
/*
console.log(f3.idof("foo"));
console.log(f3.idof(42));
console.log(f3.idof(true));
console.log(f3.idof(null));
console.log(f3.idof(undefined));
console.log(f3.idof({}));
let xxx = {};
console.log(f3.idof(xxx));
console.log(f3.idof(xxx));
console.log(f3.idof(okButton));
console.log(f3.idof(app));
console.log(f3.idof(document.body));
*/
