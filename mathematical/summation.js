if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    '../functional/reduce',
    '../functional/compose',
    '../functional/returnValue',
    './addition'
], function (reduce, compose, returnValue, addition) {
    'use strict';

    // ∑ - sum over data from ... to ... of func
    return function summation(data, func) {
        return reduce(data, compose(addition, func || returnValue, returnValue), 0);
    }
});
