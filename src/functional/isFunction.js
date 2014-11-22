
define([
    './is'
], function (is) {
    'use strict';

    /**
     * Check if value is function
     */
    return function isFunction(value) {
        return is('Function', value);
    }
});
