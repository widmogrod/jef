if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './each'
], function (each) {
    'use strict';

    /**
     * Merge two object into one
     */
    return function merge(a, b) {
        var result = {};
        each(a, function (value, key) {
            result[key] = (key in b) ? b[key] : value
        });
        return result;
    }
});
