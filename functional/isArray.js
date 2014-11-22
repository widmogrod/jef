if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './is'
], function (is) {
    'use strict';

    /**
     * Check if value is array
     */
    return function isArray(value) {
        return is('Array', value);
    }
});
