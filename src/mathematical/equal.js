if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {
    'use strict';

    return function equal(a, b) {
        return a === b;
    }
});
