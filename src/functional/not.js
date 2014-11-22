
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
