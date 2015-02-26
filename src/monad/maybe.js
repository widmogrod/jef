define(['./unit', './nothing'], function (unit, nothing) {
    'use strict';

    return function maybe(value) {
        if (value === null || typeof value === 'undefined') {
            return nothing();
        }

        return unit(value);
    }
});
