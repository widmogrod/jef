
define([
    '../functional/reduce',
    '../functional/slice'
], function (reduce, slice) {
    'use strict';

    return function division(a, b) {
        return reduce(slice(arguments, 1), function (base, i) {
            return base / i
        }, a);
    }
});
