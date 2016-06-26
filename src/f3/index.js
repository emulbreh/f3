import 'mousetrap';
import 'mousetrap/plugins/bind-dictionary/mousetrap-bind-dictionary';


export {Action} from './actions';
export {adapt, __adapt__, toString} from './adapters';
export {Application, Router, Page} from './application';
export {Button, ToggleButton} from './buttons';
export {ComponentFactory} from './componentFactories'
export {Component, Container, Root, Panel, Display} from './components'
export {config} from './config';
export {Dialog} from './dialogs';
export {ComponentStructureError, F3Error} from './errors';
export {TextInput, Checkbox, RawInput, Form, SelectBox, ComboBox, Field} from './inputs';
export {Label, defaultLabels} from './labels';
export {List} from './lists';
export {Model, Property, ListModel, properties} from './models';

import './defaultConfig';
