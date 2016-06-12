import EventEmitter from 'wolfy87-eventemitter';
import {ComponentStructureError} from './errors';
import {identity} from './utils';
import {toRenderer} from './adapters';


export class Component extends EventEmitter{
    constructor({tagName='div', cssText=null, element=null, ...config}={}) {
        super(config);
        let el = this.element = element || document.createElement(tagName);
        el.className = this.constructor.name;
        if (cssText) {
            el.style.cssText = cssText;
        }
        this.parent = null;
    }

    toString() {
        return `<${this.constructor.name} />`;
    }

    *findClosestDecendants(predicate) {
    }

    *getComponents() {
        yield this;
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

    *getComponents() {
        console.log(this);
        yield* super.getComponents();
        yield* this.children;
    }

    *findClosestDecendants(predicate) {
        for (let child of this.children) {
            if (predicate(child)) {
                yield child;
            }
            else {
                yield* child.findClosestDecendants(predicate);
            }
        }
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
    constructor({...config}={}) {
        super({element: document.body, ...config});
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
