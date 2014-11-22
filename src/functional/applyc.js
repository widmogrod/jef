
define([
    './first',
    './slice',
    './transpose',
    './map',
    './apply',
    './curry'
], function (first, slice, transpose, map, apply, curry) {
    'use strict';

    /**
     * Apply on list of arguments function but
     * arguments passed to function are taken by index
     *
     * Example:
     * applyc(multiply, [2,3], [4,5]) -> [8, 15]
     *
     * @param  Function func
     * @param  Array args
     * @return Array
     */
    return function applyc(func, args) {
        func = first(slice(arguments, 0, 1));
        args = slice(arguments, 1);
        return map(
            transpose(args),
            curry(apply, func)
        );
    }
});
