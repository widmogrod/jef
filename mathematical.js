(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('./functional.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/functional'], factory);
    } else {  // Browser globals
        root.jef = root.jef || {};
        root.jef.mathematical = factory(root.jef.functional);
    }
})(this, function(f){
    'use strict';

    // in alphabetical order
    function equal(a, b) {
        return a === b;
    };

    function addition(a, b) {
        return f.reduce(f.slice(arguments, 1), function(i, base) {return base + i}, a);
    };

    function subtraction(a, b) {
        return f.reduce(f.slice(arguments, 1), function(i, base) {return base - i}, a);
    };

    function multiplication(a, b) {
        return f.reduce(f.slice(arguments, 1), function(i, base) {return base * i}, a);
    };

    function division(a, b) {
        return f.reduce(f.slice(arguments, 1), function(i, base) {return base / i}, a);
    };

    // ∑ - sum over data from ... to ... of func
    function summation(data, func) {
        return f.reduce(data, f.compose(addition, func || f.returnValue, f.returnValue), 0);
    };

    var exports = {};

    exports.equal           = equal;
    exports.addition        = addition;
    exports.subtraction     = subtraction;
    exports.multiplication  = multiplication;
    exports.division        = division;
    exports.summation       = summation;

    return exports;
});
