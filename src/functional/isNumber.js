
define([
    './is'
], function (is) {
    'use strict';

    /**
     * Check if value is number
     */
    return function isNumber(value) {
        return is('Number', value);
    }
});
