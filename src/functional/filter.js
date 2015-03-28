
define([
    './each',
    './isFilterable'
], function (each, isFilterable) {
    'use strict';

    /**
     * Return new array containing values validated by function
     *
     * @param {{filter: function}} data
     * @param {Function} func
     * @param {*} thisArg
     * @return {*}
     */
    return function filter(data, func, thisArg) {
        if (isFilterable(data)) {
            // Embrace native implementation
            return data.filter(func, thisArg);
        }

        var result = [];
        each(data, function (item, i) {
            if (func.call(thisArg, item, i, data)) {
                result.push(item);
            }
        });
        return result;
    }
});
