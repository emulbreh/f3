import {Component, Container} from './components';
import {toComponentFactory} from './adapters';


export class List extends Container() {
    constructor({model, itemFactory, ...config}) {
        super(config);
        this.model = model;
        this.itemFactory = toComponentFactory(itemFactory);
        this.componentMap = new Map();
        for (let item of model) {
            this.addItem(item);
        }
        model.on('ItemAdded', (e) => {this.addItem(e.item);});
        model.on('ItemRemoved', (e) => {this.removeItem(e.item);});
        model.on('ItemsReordered', (e) => {this.applyOrdering();});
    }

    applyOrdering() {
        let expectedOrder = [...this.model].map((item) => this.componentMap[item]);
        let previous = null;
        for (let i = expectedOrder.length - 1; i >= 0; i--) {
            let element = expectedOrder[i].element;
            this.element.insertBefore(element, previous);
            previous = element;
        }
    }

    addItem(item) {
        let component = this.itemFactory({model: item});
        this.addComponent(component);
        this.componentMap[item] = component;
    }

    removeItem(item) {
        this.removeComponent(this.componentMap[item]);
    }

    insertElement(child) {
        this.model.indexOf(c);
    }
}
