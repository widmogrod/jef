define([
    './each',
    './isReduceable'
], function(each, isReduceable) {
    'use strict';

    /**
     * Reduce array to base using function
     */
    return function reduce(data, func, base) {
        if (isReduceable(data)) {
            return data.reduce(func, base);
        }

        each(data, function(item, index, data) {
            base = func(base, item, index, data);
        });
        return base;
    };
});
