define([
    './each',
    './isObject'
], function (each, isObject) {
    'use strict';

    function assign(result) {
        return function(value, key) {
            result[key] = isObject(value)
                ? clone(value)
                : value;
        }
    }

    /**
     * Merge two object into one
     *
     * @param {*} value
     * @return {*}
     */
    function clone(value) {
        var copy = value.constructor();

        each(value, assign(copy));

        return copy;
    }

    return clone;
});
