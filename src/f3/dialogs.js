import {Root, Frame, Panel, Display} from './components';
import {Button} from './buttons';
import {Signal} from './signals';
import {Label, defaultLabels} from './labels';
import {adapt} from './adapters';


function makeCover(component) {
    let coverEl = document.createElement('div');
    coverEl.classList.add('cover');
    component.element.appendChild(coverEl);
    return {
        dispose(){
            coverEl.parentNode.removeChild(coverEl);
        }
    }
}


export class Dialog extends Root(Frame) {
    constructor({title='', ...config}) {
        super({...config});
        this.opened = new Signal();
        this.closed = new Signal();
        this.title = adapt(Label, title);
        this.header = this.addComponent(new Panel({
            className: 'header',
            children: [
                this.title.create(),
                new Button({
                    label: defaultLabels.close,
                    action: () => {
                        this.close();
                    }
                })
            ]
        }));
        document.body.appendChild(this.element);
    }

    close() {
        this.hide();
        this.cover.dispose();
        this.closed.emit();
    }

    open() {
        this.cover = makeCover(this.app.root);
        this.show();
        this.opened.emit();
    }
}
