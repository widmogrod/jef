if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    '../functional/reduce',
    '../functional/slice'
], function (reduce, slice) {
    'use strict';

    return function division(a, b) {
        return reduce(slice(arguments, 1), function (i, base) {
            return base / i
        }, a);
    }
});
