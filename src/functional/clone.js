define([
    './isObject'
], function (isObject) {
    'use strict';

    /**
     * Merge two object into one
     *
     * @param {*} value
     * @return {*}
     */
    function clone(value) {
        var copy = new value.constructor();
        for (var i in value) {
            if (value.hasOwnProperty(i)) {
                copy[i] = isObject(value[i])
                    ? clone(value[i])
                    : value[i];
            }
        }
        return copy;
    }

    return clone;
});
