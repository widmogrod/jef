
define([
    './first',
    './slice',
    './map'
], function (first, slice, map) {
    'use strict';

    /**
     * For each element form invoke method with arguments
     *
     * Examples:
     * invoke([{add: add1}, {add:add2}], 'add', 1) -> [2, 3]
     */
    return function invoke(list, method, args) {
        list = first(slice(arguments, 0, 1));
        method = slice(arguments, 1, 2);
        args = slice(arguments, 2);
        return map(list, function (item) {
            return args.length > 0 ? item[method].apply(item, args) : item[method]();
        });
    }
});
