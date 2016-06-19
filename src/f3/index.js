import 'mousetrap';
import 'mousetrap/plugins/bind-dictionary/mousetrap-bind-dictionary';

export {ComponentStructureError, F3Error} from './errors';
export {Component, Container, Root, Panel, Display} from './components'
export {Button} from './buttons';
export {TextInput, Checkbox, RawInput, Form, SelectBox, ComboBox, Field} from './inputs';
export {List} from './lists';
export {Model, Property, ListModel, properties} from './models';
export {adapt, __adapt__, toString} from './adapters';
export {ComponentFactory} from './componentFactories'
export {Application, Router, Page} from './application';
export {Action} from './actions';
export {Label} from './labels';
export {config} from './config';

import './defaultConfig';
