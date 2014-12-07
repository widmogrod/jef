define(['./some'], function(some) {
    'use strict';

    /**
     * Tests whether item is in the array.
     *
     * @param {Array} array
     * @param {*} test
     * @return {Boolean}
     */
    return function contains(array, test) {
        return some(array, function(value) {
            return value === test;
        });
    }
});
