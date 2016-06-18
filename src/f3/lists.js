import {Component, Container} from './components';
import {toComponentFactory} from './adapters';
import {Signal} from './signals';


export class List extends Container() {
    constructor({model, itemFactory, selectable=true, cursorClass='cursor', ...config}) {
        super(config);
        this.model = model;
        this.cursorClass = cursorClass;
        this.itemFactory = toComponentFactory(itemFactory);
        // FIXME: componentMap doesn't work for duplicate list items
        this.componentMap = new Map();
        for (let item of model) {
            this.addItem(item);
        }
        model.itemAdded.then((e) => {this.addItem(e.item);});
        model.itemRemoved.then((e) => {this.removeItem(e.item);});
        model.itemsReordered.then((e) => {this.applyOrdering();});
        this.selectedItem = null;
        this.selectedIndex = -1;
        this.itemClicked = new Signal();
        this.itemSelected = new Signal();
        this._cursorIndex = -1;
        this.clicked.then((e) => {
            let element = e.event.target;
            while (element) {
                let item = element.dataset.item;
                if (item) {
                    this.onItemClicked(item);
                    break;
                }
                element = element.parentNode;
            }
        });
        this.cursorKeyboardHandlers = {
            'down': () => {
                this.moveCursorDown();
            },
            'up': () => {
                this.moveCursorUp();
            },
            'enter': () => {
                this.selectIndex(this.cursorIndex);
            }
        };
    }

    onItemClicked(item) {
        this.itemClicked.emit({
            item: item,
            list: this
        });
        this.selectItem(item);
    }

    selectIndex(index) {
        this.selectItem(this.model.get(index));
    }

    selectItem(item) {
        if (item === this.selectedItem) {
            return;
        }
        this.selectedItem = item;
        this.itemSelected.emit({
            item: item,
            list: this
        });
    }

    get cursorIndex() {
        return this._cursorIndex;
    }

    set cursorIndex(index) {
        index = index % this.model.length;
        if (index == this._cursorIndex) {
            return;
        }
        if (this._cursorIndex != -1) {
            let component = this.componentMap[this.model.get(this._cursorIndex)];
            component.removeClass(this.cursorClass);
        }
        this._cursorIndex = index;
        if (index == -1) {
            return;
        }
        let item = this.model.get(index);
        let component = this.componentMap[item];
        console.log(index, item, component);
        component.addClass(this.cursorClass);

    }

    moveCursorDown() {
        this.cursorIndex = this.cursorIndex + 1;
    }

    moveCursorUp() {
        if (this.cursorIndex != -1) {
            this.cursorIndex = this.cursorIndex + this.model.length - 1;
        }
        else {
            this.cursorIndex = this.model.length - 1;
        }
    }

    getChildByElement() {

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
        component.element.dataset.item = item;
        this.addComponent(component);
        this.componentMap[item] = component;
    }

    removeItem(item) {
        this.removeComponent(this.componentMap[item]);
    }
}
