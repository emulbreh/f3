import {ComponentStructureError} from './errors';
import {identity} from './utils';
import {toRenderer, toString, toAction} from './adapters';
import {Signal, HtmlSignal} from './signals';


export class Component {
    constructor({tagName='div', cssText=null, element=null, focusable=false, keymap=null, ...config}={}) {
        let el = this.element = element || document.createElement(tagName);
        let c = this.constructor;
        do {
            el.classList.add(c.name);
            c = c.__proto__;
        } while (c.prototype instanceof Component);
        if (cssText) {
            el.style.cssText = cssText;
        }
        this.focusable = focusable;
        this._focusElement = null;
        this.focusElement = this.element;
        this.clicked = new HtmlSignal({type: 'click', component: this});
        this.parent = null;
        if (keymap) {
            this.installKeymap(keymap);
        }
    }

    set focusElement(element) {
        this._focusElement = element;
        if (['INPUT', 'TEXTAREA'].includes(element.tagName)) {
            element.tabIndex = this.focusable ? 0 : -1;
        }
        else if (this.focusable) {
            element.tabIndex = 0;
        }
    }

    get focusElement() {
        return this._focusElement;
    }

    installKeymap(keymap) {
        Mousetrap(this.focusElement).bind(keymap);
    }

    addClass(className) {
        this.element.classList.add(className);
    }

    removeClass(className) {
        this.element.classList.remove(className);
    }

    get root() {
        if (!this.parent) {
            throw new ComponentStructureError(`${this} doesn't have a root.`);
        }
        return this.parent.root;
    }

    get app() {
        return this.root.app;
    }

    toString() {
        return `<${this.constructor.name} />`;
    }

    getChildren() {
        return [];
    }

    *getComponents() {
        yield this;
    }

    *getComponents() {
        yield this;
        for (let child of this.getChildren()) {
            yield* child.getComponents();
        }
    }

    *findClosestDecendants(predicate) {
        for (let child of this.getChildren()) {
            if (predicate(child)) {
                yield child;
            }
            else {
                yield* child.findClosestDecendants(predicate);
            }
        }
    }

    show() {
        this.element.style.display = '';
        return Promise.resolve();
    }

    hide() {
        this.element.style.display = 'none';
        return Promise.resolve();
    }
}


function defineMixin(func) {
    let cache = new Map();
    return (base) => {
        if (!cache[base]) {
            cache[base] = func(base);
        }
        return cache[base];
    };
}


export var Container = defineMixin((base=Component) => class Container extends base {
    constructor({children=[], ...config}={}) {
        super(config);
        this.children = [];
        this.addComponents(children);
    }

    getChildren() {
        return this.children;
    }

    addComponent(component, index) {
        if (index === undefined || index == this.children.length) {
            index = this.children.length;
            this.element.appendChild(component.element);
            this.children.push(component);
        }
        else {
            this.element.insertBefore(this.components[index].element, component.element);
            this.children.splice(index, 0, component);
        }
        component.parent = this;
        return component;
    }

    addComponents(components) {
        for(let component of components) {
            this.addComponent(component);
        }
    }

    removeComponent(component) {
        let index = this.children.indexOf(component);
        if (index < 0) {
            throw new ComponentStructureError(`${component} is not a child of ${this}`);
        }
        component.parent = null;
        this.children.splice(index, 1);
        this.element.removeChild(component.element);
    }

});

export class Panel extends Container() {

}


export class Display extends Component {
    constructor({model, renderer=toString, ...config}={}) {
        super(config);
        this.renderer = toRenderer(renderer);
        this.model = model;
    }

    set model(model) {
        this._model = model;
        this.element.innerHTML = this.renderer(model);
    }

    get model() {
        return this._model;
    }
}

export class Root extends Container() {
    constructor({app, ...config}={}) {
        super({element: document.body, ...config});
        this._app = app;
    }

    get app() {
        return this._app;
    }

    get root() {
        return this;
    }
}


export class Window extends Container() {
    constructor({...config}={}) {
        super(config);
        this._content = null;
    }

    set content(component) {
        if (this._content === component) {
            return;
        }
        if (this._content) {
            this.removeComponent(this._content);
        }
        this.addComponent(component);
        this._content = component;
    }

    get content() {
        return this._component;
    }

}


export class Button extends Component {
    constructor({action, label, ...config}) {
        super({tagName: 'button', ...config});
        this.action = toAction(this, action);
        this.label = label;
        this.element.addEventListener('click', (event) => {
            this.action.perform({event});
        });
    }

    set label(text) {
        this.element.innerHTML = text;
    }
}
