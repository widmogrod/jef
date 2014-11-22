if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {
    'use strict';

    /**
     * Retrieve key on a object
     *
     * Example:
     * get(1)(['a','b','c']) -> 'b'
     * get('length')(['a','b','c']) -> 3
     */
    return function get(key) {
        return function (obj) {
            return obj[key];
        }
    }
});
