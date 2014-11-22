
define([
    './each'
], function (each) {
    'use strict';

    /**
     * Reduce array to base using function
     */
    return function reduce(data, func, base) {
        each(data, function (item) {
            base = func(item, base);
        });
        return base;
    }
});
