
export function F3Error(message){
    this.name = this.constructor.name;
    this.message = message;
    Error.call(this);
}

F3Error.prototype.__proto__ = Error.prototype;


export class ComponentStructureError extends F3Error {
}
