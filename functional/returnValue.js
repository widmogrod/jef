if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {
    'use strict';

    /**
     * Return value function
     * Example: returnValue(1) -> 1
     */
    return function returnValue(item) {
        return item;
    }
});
