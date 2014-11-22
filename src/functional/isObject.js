if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './is'
], function (is) {
    'use strict';

    /**
     * Check if value is object
     */
    return function isObject(value) {
        return is('Object', value);
    }
});
