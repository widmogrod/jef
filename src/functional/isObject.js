
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
