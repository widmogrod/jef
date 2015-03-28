define(function() {
    'use strict';

    /**
     * Concat two arrays into one
     *
     * @param {Array} array1
     * @param {Array} array2
     * @return {Array}
     */
    return function concat(array1, array2) {
        return Array.prototype.concat.apply([], arguments);
    };
});
