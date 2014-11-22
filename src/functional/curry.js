if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './slice'
], function (slice) {
    'use strict';

    /**
     * Curry function
     *
     * Example:
     * curry(function(a, b, c, d)) -> a(b)(c)(d)
     */
    return function curry(func) {
        var count = func.length;
        var args = slice(arguments, 1);
        if (!count) {
            return func;
        }
        if (args.length < count) {
            return function carried() {
                var newArgs = [func];
                newArgs.push.apply(newArgs, args);
                newArgs.push.apply(newArgs, slice(arguments));
                return curry.apply(null, newArgs);
            }
        } else {
            return func.apply(null, args);
        }
    }
});
