if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './isNumber'
], function (isNumber) {
    'use strict';

    /**
     * Apply function on each data element
     */
    return function each(data, func, start, end) {
        var i = 0,
            keys = Object.keys(data),
            length = keys.length,
            key;

        isNumber(start) && (i = (start < 0) ? length + start : start);
        isNumber(end) && (length = (end < 0) ? length + end : end);

        for (; i < length; i++) {
            key = keys[i];
            func(data[key], key);
        }
    }
});
