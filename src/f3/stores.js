import {F3Error} from './errors';


class ObjectDoesNotExist extends F3Error {

}


class Store {
    constructor({pkProperty: 'pk'}) {
        this.pkProperty = pkProperty;
        this.instanceCache = new Map();
    }

    getPrimaryKey(obj) {
        return obj[this.pkProperty];
    }

    create(obj) {
        let pk = this.getPrimaryKey(obj);
        this.instanceCache[pk] = obj;
    }

    update(obj) {

    }

    delete(obj) {

    }

    get(pk) {
        this.instanceCache[pk];
    }

    list() {

    }
}
