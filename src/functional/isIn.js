if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {
    'use strict';

    /**
     * Check if value is in array
     *
     * @param {Array} array
     * @param {[type]} value
     * @return {Integer}
     */
    return function isIn(array, value) {
        return array.indexOf(value);
    }
});
