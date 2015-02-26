define(function () {
    'use strict';

    return function monad(fn) {
        return {
            bind: fn
        };
    }
});
