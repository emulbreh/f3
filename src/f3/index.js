import 'mousetrap';
import 'mousetrap/plugins/bind-dictionary/mousetrap-bind-dictionary';
//import 'babel-polyfill';


export {Action} from './actions';
export {adapt, __adapt__, toString} from './adapters';
export {Application, Router, Page} from './application';
export {Button, ToggleButton} from './buttons';
export {ComponentFactory} from './componentFactories'
export {Component, Container, Root, Panel, Display} from './components'
export {config} from './config';
export {Dialog} from './dialogs';
export {ComponentStructureError, F3Error} from './errors';
export {TextInput, Checkbox, RawInput, Form, SelectBox, ComboBox, Field, TextArea} from './inputs';
export {Label, defaultLabels} from './labels';
export {List} from './lists';
export {Model, Property, ListModel, properties, idof, __id__} from './models';
export {Type, Boolean, String, Number, Float, Integer} from './models';
export {makeModelForm} from './modelForms';

import './defaultConfig';
