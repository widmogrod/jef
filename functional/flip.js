if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './apply',
    './slice'
], function (apply, slice) {
    'use strict';

    /**
     * Flip order of arguments when invoking function
     * @param  Function func
     * @return Function
     */
    return function flip(func) {
        return function (arg1, arg2) {
            return apply(func, slice(arguments).reverse());
        }
    }
});
