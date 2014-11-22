if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './src/reactive/value',
    './src/reactive/observable'
], function(value, observable) {
    'use strict';

    return {
        value: value,
        observable: observable
    }
});
