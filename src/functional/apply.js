if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './first',
    './slice',
    './map'
], function (first, slice, map) {
    'use strict';

    /**
     * Apply arguments to function
     *
     * Examples:
     * apply(addition, [1,2]) -> 3
     * apply(addition, [1,2], [2,3]) -> [3, 5]
     */
    return function apply(func, args) {
        func = first(slice(arguments, 0, 1));
        args = slice(arguments, 1);
        var result = map(args, function (args) {
            switch (args && args.length) {
                case 0:
                    return func.call(func);
                case 1:
                    return func.call(func, args[0]);
                case 2:
                    return func.call(func, args[0], args[1]);
                default:
                    return func.apply(func, args);
            }
        });
        return args.length > 1 ? result : first(result);
    }
});
