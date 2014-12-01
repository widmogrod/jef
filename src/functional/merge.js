define([
    './each',
    './isObject'
], function (each, isObject) {
    'use strict';

    function assign(result) {
        return function(value, key) {
            result[key] = isObject(result[key]) && isObject(value)
                ? merge(result[key], value)
                : value;
        }
    }

    /**
     * Merge two object into one
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object}
     */
    function merge(a, b) {
        var result = {};
        var collect = assign(result);

        each(a, collect);
        each(b, collect);

        return result;
    }

    return merge;
});
