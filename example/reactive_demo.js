(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../functional.js'),
            require('../reactive.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/functional', 'jef/reactive'], factory);
    } else {  // Browser globals
        root.jefdemo = root.jefdemo || {};
        root.jefdemo.reactive_demo = factory(
            root.jef.functional,
            root.jef.reactive
        );
    }
})(this, function(f, r){
    'use strict';

    function display(value) {
        return function() {
            console.log('Triggered on change; {c} value is: ' + value());
        }
    }

    function sum(a, b) {
        return function() {
            return a() + b();
        }
    }

    function replace(string) {
        return function() {
            var args = f.slice(arguments);
            return string.replace(/{([^}]+)}/gm, function(key) {
                return args.shift()();
            });
        }
    }

    var a, b, c, message;

    message = replace('Current result of {a} + {b} = {c}');

    a = r.value(1);
    b = r.value(1);
    c = sum(a, b);

    message = message.bind(message, a, b, c);
    console.log(message());

    a = r.observable(a, display(c));
    b = r.observable(b, display(c));

    a(2);
    console.log(message());
    a(3);
    console.log(message());
    b(4);
    console.log(message());

});
