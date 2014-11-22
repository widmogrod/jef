if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './isArray',
    './returnValue',
    './each'
], function (isArray, returnValue, each) {
    'use strict';

    /**
     * Transpose array, optionally apply function on each item;
     *
     * Examples:
     * From:
     * [
     *     [a,b],
     *     [c,d]
     * ]
     * To:
     * [
     *     [a, c]
     *     [b, d]
     * ]
     *
     * From:
     * [a,b,c]
     * To:
     * [
     *     [a],
     *     [b],
     *     [c]
     * ]
     */
    return function transpose(array, func) {
        func = func || returnValue;

        if (!isArray(array)) {
            return [func(array)];
        }

        var result = [];
        each(array, function (value, col) {
            if (isArray(value)) {
                each(value, function (item, idx) {
                    item = func(item);
                    result[idx] = result[idx] ? result[idx] : [];
                    result[idx][col] = item;
                });
            } else {
                result[col] = [func(value)];
            }
        });
        return result;
    }
});
