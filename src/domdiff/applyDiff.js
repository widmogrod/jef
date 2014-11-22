if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './diff'
], function(diff) {
    'use strict';

    /**
     * Apply on element 'a' changes from 'b' using given diff
     *
     * @param {Element} a
     * @param {Element} b
     * @param {String} diff
     */
    return function applyDiff(a, b, diff) {
        return new Function('aElement', 'bElement', diff)(a, b);
    }
});
