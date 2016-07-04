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
export {Model, Property, ListModel} from './models';
export {makeModelForm} from './modelForms';
export {idof, __id__, valueof, __value__} from './protocols';
export {Type, Boolean, String, Number, Float, Integer} from './types';

import './defaultConfig';
