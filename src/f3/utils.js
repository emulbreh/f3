
export const identity = (x) => x;
export const constant = (x) => (() => x);

export const uniqueId = (() => {
    let nextId = 1;
    return function uniqueId() {
        return '' + (nextId++);
    }
})();
