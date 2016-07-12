import {Input} from 'f3';

import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import 'codemirror/theme/elegant.css';
//import 'codemirror/theme/eclipse.css';
//import 'codemirror/theme/neo.css';
//import 'codemirror/theme/hopscotch.css';
import js from 'codemirror/mode/javascript/javascript';

export class CodeMirrorEditor extends Input {
    constructor({value='', ...config}={}) {
        super({...config});
        this.editor = new CodeMirror(this.element, {
            value: value,
            mode: 'javascript',
            theme: 'elegant'
        });
        this.value = value;
    }

    setValue(value) {
        super.setValue(value);
        setTimeout(() => this.editor.refresh(), 1);
    }

    getValue() {
        return this.editor.getValue();
    }
}
