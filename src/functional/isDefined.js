if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {
    'use strict';

    /**
     * Check if valie is defined
     */
    return function isDefined(value) {
        return 'undefined' !== typeof value;
    }
});
