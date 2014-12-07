define(function() {
    'use strict';

    /**
     * Tests whether some element in the array passes the test implemented by the provided function.
     *
     * @param {Array} array
     * @param {Function} fn
     * @return {Boolean}
     */
    return function some(array, fn) {
        for (var i = 0, length = array.length; i < length; i++) {
            if (fn(array[i], i, array)) {
                return true;
            }
        }

        return false;
    }
});
