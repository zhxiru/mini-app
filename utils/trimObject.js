'use strict'

export default function trimObject(obj) {
    if (!Array.isArray(obj) && typeof obj != 'object') {
        return obj;
    }

    return Object.keys(obj).reduce(function(acc, key) {
        acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : trimObject(obj[key]);
        return acc;
    }, Array.isArray(obj) ? [] : {});
}
