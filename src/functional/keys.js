define(['./isFunction', './isArray'], function(isFunction, isArray) {
    'use strict';

    /**
     * Return list of keys for given value
     *
     * @return {Array}
     */
    return function keys(value) {
        return value && isFunction(value.keys) && !isArray(value)
            ? value.keys()
            : Object.keys(value);
    };
});