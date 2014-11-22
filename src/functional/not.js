if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './apply'
], function (apply) {
    'use strict';

    /**
     * Return negation of the value returned by function
     */
    return function not(func) {
        return function () {
            return !apply(func, arguments);
        };
    }
});
