define(function () {
    'use strict';

    return function observable(value, fn) {
        return function(set, old) {
            if (arguments.length) {
                old = value();
                value(set);
                old !== set && fn(set, old);
                return this;
            }
            return value();
        }
    }
});
