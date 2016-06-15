
export class Signal {
    constructor({name, setup, teardown}={}) {
        this.name = name;
        this.listeners = [];
        this.setup = setup;
        this.teardown = teardown;
    }

    then(callback) {
        this.listeners.push(callback);
        if (this.listeners.length == 1 && this.setup) {
            this.setup.call(this);
        }
    }

    remove(callback) {
        let index = this.listeners.indexOf(callback);
        if (index != -1) {
            this.listeners.splice(index, 1);
        }
        if (this.listeners.length == 0 && this.teardown) {
            this.teardown.call(this);
        }
    }

    once(callback) {
        this.then(callback);
        this.then(() => {this.remove(callback);});
    }

    emit(event) {
        for (let listener of this.listeners) {
            listener(event);
        }
    }
}


export class HtmlSignal extends Signal{
    constructor({component, type, options={capture: false}, ...config}) {
        super(config);
        let onBrowserEvent = (event) => {
            this.emit({event, component});
        };
        this.setup = () => {
            console.log("setup", component, component.element, options);
            component.element.addEventListener(type, onBrowserEvent, options);
        };
        this.teardown = () => {
            component.element.removeEventListener(type, onBrowserEvent, options);
        }
    }
}
