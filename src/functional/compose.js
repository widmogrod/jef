
define([
    './slice',
    './map'
], function (slice, map) {
    'use strict';

    /**
     * Composer function argument via another functions
     */
    return function compose(base, first) {
        var more = arguments.length > 2;
        var functions = slice(arguments, 1);
        return function () {
            var args = slice(arguments);
            return base.apply(null, map(functions, function (func) {
                return func.call(null, more ? args.shift() : args);
            }));
        }
    }
});
