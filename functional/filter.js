if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './each'
], function (each) {
    'use strict';

    /**
     * Return new array containing values validated by function
     */
    return function filter(data, func) {
        var result = [];
        each(data, function (item, i) {
            if (func(item, i)) {
                result.push(item);
            }
        });
        return result;
    }
});
