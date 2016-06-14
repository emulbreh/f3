import EventEmitter from 'wolfy87-eventemitter';
import {Root, Window} from './components';
import {F3Error} from './errors';


export class Page {
    constructor({root, ...config}) {
        this.root = root;
    }

    open(win, params) {
        win.content = this.root;
    }
}


export class NotFoundError extends F3Error {

}


export class Router extends EventEmitter {
    static groupTypes = {
        'int': '(\d+)',
        'uuid': '([a-fA-F0-9-]+)',
        'any': '([^/]+)',
        'path': '(.*)'
    };

    static defaultGroupType = 'any';

    constructor({routes=[]}={}) {
        super();
        this.routes = routes;
    }

    compilePattern(pattern) {
        let params = [];
        let regex = pattern.replace(/\{\w+(?::\w+)?\}/, (match) => {
            let [name, type] = match.substring(1, match.length - 1).split(':');
            type = type || this.constructor.defaultGroupType;
            let param = {name, type, regex: Router.groupTypes[type] || type};
            params.push(param);
            return param.regex;
        });
        return {regex: new RegExp(`^${regex}$`), params};
    }

    addRoute(pattern, action) {
        this.routes.push({
            pattern,
            action,
            ...this.compilePattern(pattern)
        });
    }

    match(url) {
        for (let route of this.routes) {
            let match = route.regex.exec(url);
            if (match) {
                let params = {};
                route.params.forEach((param, i) => {
                    params[param.name] = match[i + 1];
                });
                return [route, params];
            }
        }
        throw new NotFoundError();
    }

    call(url) {
        let [route, params] = this.match(url);
        route.action(url, params);
    }
}


export class Application extends EventEmitter {
    constructor({win, router}={}) {
        super();
        this.root = new Root({app: this});
        this.router = router || new Router();
        this.window = this.root.addComponent(win || new Window());

        window.addEventListener('popstate', (e) => {
            console.log(e, window.location.pathname);
            try {
                this.router.call(window.location.pathname);
            }
            catch(e) {
                if (e instanceof NotFoundError) {
                    // FIXME
                    console.log(e);
                }
                throw e;
            }
            e.preventDefault();
        });
        window.addEventListener('click', (e) => {
            if (e.target.tagName == 'A') {
                e.preventDefault();
                this.router.call(e.target.pathname);
            }
        });
        window.addEventListener('load', (e) => {
            this.router.call(window.location.pathname);
        });
    }

    addPage(route, page) {
        this.router.addRoute(route, (url, params) => {
            page.open(this.window, params);
            window.history.pushState(params, null, url);
        });
    }
}
