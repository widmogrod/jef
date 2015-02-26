define(['./monad'], function (monad) {
    'use strict';

    return function unit(value) {
        return monad(function (transformFn) {
            return transformFn(value);
        });
    }
});
