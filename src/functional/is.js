if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {
    'use strict';

    /**
     * Check if object is given type
     */
    return function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }
});
