if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './first',
    './slice',
    './each'
], function (first, slice, each) {
    'use strict';

    /**
     * Map function
     *
     * Examples:
     * map([1, 2, 3], addOne) -> [2, 3, 4]
     * map([1, 2, 3], [2, 3, 6], addOne) -> [[2, 3, 4], [3, 4, 7]]
     *
     * @return []
     */
    return function map(data, func, start, end) {
        data = slice(arguments, 0, -1);
        func = first(slice(arguments, -1));
        var result = [];
        each(data, function (item, idx) {
            result[idx] = [];
            each(item, function (value, col) {
                result[idx][col] = func(value);
            }, start, end)
        });
        return data.length > 1 ? result : first(result);
    }
});
