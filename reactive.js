if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './reactive/value',
    './reactive/observable'
], function(value, observable) {
    'use strict';

    return {
        value: value,
        observable: observable
    }
});
