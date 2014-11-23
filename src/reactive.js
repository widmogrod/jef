
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
