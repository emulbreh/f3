import {padEnd, padStart} from 'lodash';
import {repr} from './utils.js';


const replacementTypes = {
    f: (flags, width, precision) => {
        if (precision) {
            return (value) => value.toFixed(precision);
        }
        return String;
    },
    g: (flags, width, precision) => {
        if (precision) {
            return (value) => value.toPrecision(precision);
        }
        return String;
    },
    i: (flags, width, precision) => {
        return (value) => value.toString(10);
    },
    j: (flags, width, precision) => {
        return JSON.stringify;
    },
    r: (flags, width, precision) => {
        return repr;
    },
    s: (flags, width, precision) => {
        return String;
    },
    e: (flags, width, precision) => {
        return (value) => value.toExponential();
    },
    E: (flags, width, precision) => {
        return (value) => value.toExponential().toUpperCase();
    },
    x: (flags, width, precision) => {
        return (value) => value.toString(16);
    },
    X: (flags, width, precision) => {
        return (value) => value.toString(16).toUpperCase();
    }
};

function paddedFormat(flags, width, precision, func) {
    let pad = flags.includes('-') ? padEnd : padStart;
    return (value) => pad(func(value), width, flags.includes('0') ? '0' : ' ');
}

export function format(src) {
    let replacements = [];
    let pattern = src.replace(/\{(\w+)(?:!([ #0+-]*)([1-9]\d*)?(?:\.(\d+))?([eEfghijrsxX]))?(?:=([^}]*))?\}/g, (match, attr, flags, width, precision, type, defaultValue) => {
        let formatFunc = replacementTypes[type || 's'](
            flags,
            width ? parseInt(width, 10) : undefined,
            precision ? parseInt(precision, 10) : undefined,
        )
        if (width) {
            formatFunc = paddedFormat(flags, width, precision, formatFunc);
        }
        replacements.push((args) => {
            let value = args[attr];
            if (value === undefined && defaultValue !== undefined) {
                value = eval(defaultValue);
            }
            return formatFunc(value);
        });
        return '{}';
    });
    return (args) => {
        let i = 0;
        return pattern.replace(/\{\}/g, (match) => {
            return replacements[i++](args);
        });
    };
}
