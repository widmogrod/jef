
define([
    './isArray'
], function (isArray) {
    'use strict';

    /**
     * Fill with value n-times array
     *
     * Examples:
     * fill(1, 2) -> [1, 1]
     */
    return function fill(withValue, nTimes, array) {
        array = isArray(array) ? array : [];
        while (nTimes--) {
            array.push(withValue);
        }
        return array;
    }
});
