(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(factory);
    } else { // Browser globals
        root.jef = root.jef || {};
        root.jef.reactive = factory();
    }
})(this, function() {
    'use strict';

    /**
     * Base function for storing, retrieving variables
     */
    function value(v) {
        return function(set) {
            if (arguments.length) {
                v = set;
                return this;
            }
            return v;
        }
    }

    function observable(value, fn) {
        return function(set, old) {
            if (arguments.length) {
                old = value();
                value(set);
                old !== set && fn(set, old)
                return this;
            }
            return value();
        }
    }

    var exports = {};

    exports.value = value;
    exports.observable = observable;

    return exports;
});
