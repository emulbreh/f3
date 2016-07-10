import {ComponentStructureError} from './errors';
import {identity, repr} from './utils';
import {adapt, toString} from './adapters';
import {Signal, HtmlSignal} from './signals';
import {Renderer} from './renderers';
import {Action} from './actions';


export class Component {
    constructor({tagName='div', cssText=null, className=null, element=null, focusable=false, keymap=null, ...config}={}) {
        let el = this.element = element || document.createElement(tagName);
        let c = this.constructor;
        do {
            el.classList.add(c.name);
            c = c.__proto__;
        } while (c.prototype instanceof Component);
        if (className) {
            el.classList.add(className);
        }
        if (cssText) {
            el.style.cssText = cssText;
        }
        this.focusable = focusable;
        this._focusElement = null;
        this.focusElement = el;

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
        this.removeClass('hidden');
        return Promise.resolve();
    }

    hide() {
        this.addClass('hidden');
        return Promise.resolve();
    }

    focus() {
        this.focusElement.focus();
    }

    blur() {
        this.focusElement.blur();
    }

    click(el=null) {
        el = el || this.element;
        el.dispatchEvent(new MouseEvent('click', {
            target: el
        }));
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


export const Container = defineMixin((base=Component) => class Container extends base {
    constructor({children=[], ...config}={}) {
        super(config);
        this.children = [];
        this.addComponents(children);
    }

    getChildren() {
        return this.children;
    }

    addComponent(component, index) {
        if (index === undefined || index === this.children.length) {
            index = this.children.length;
            this.element.appendChild(component.element);
            this.children.push(component);
        }
        else{
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
        this.renderer = adapt(Renderer, renderer);
        this._boundUpdate = this.update.bind(this);
        this.model = model;
    }

    update() {
        if (this._model instanceof HTMLElement) {
            this.element.innerHTML = '';
            this.element.appendChild(this._model);
        }
        else {
            this.element.innerHTML = this.renderer.render(this._model);
        }
    }

    set model(model) {
        if (this._model && this._model.propertyChanged) {
            this._model.propertyChanged.remove(this._boundUpdate);
        }
        this._model = model;
        if (model && model.propertyChanged) {
            model.propertyChanged.then(this._boundUpdate);
        }
        this.update();
    }

    get model() {
        return this._model;
    }
}

export var Root = defineMixin((base=Component) => class Root extends base {
    constructor({app, ...config}={}) {
        super(config);
        this._app = app;
    }

    get app() {
        return this._app;
    }

    get root() {
        return this;
    }
});


export class Frame extends Container() {
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
