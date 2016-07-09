
export const identity = (x) => x;
export const constant = (x) => (() => x);

export const uniqueId = (() => {
    let nextId = 1;
    return function uniqueId() {
        return '' + (nextId++);
    }
})();

export const __repr__ = Symbol('f3.__repr__');

export function repr(obj) {
    switch (typeof(obj)) {
        case 'object':
            if (obj !== null) {
                let func = obj[__repr__];
                if (func) {
                    return func.apply(obj);
                }
            }
            break;
        case 'function':
            if (obj.name) {
                return `function ${obj.name}(){}`;
            }
            return String(obj);
    }
    return JSON.stringify(obj);
}
