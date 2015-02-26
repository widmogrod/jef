define(['./monad'], function (monad) {
    'use strict';

    return function nothing() {
        return monad(function () {
            return nothing();
        });
    }
});
