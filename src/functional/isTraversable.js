if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './isArray',
    './isObject'
], function (isArray, isObject) {
    'use strict';

    /**
     * Check if value is traversable
     *
     * @param  Array|Object  value
     * @return {Boolean}
     */
    return function isTraversable(value) {
        return isArray(value) || isObject(value);
    }
});
