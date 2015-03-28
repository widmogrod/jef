define(['./monad'], function (monad) {
    'use strict';

    return function lift2(m1, m2) {
        return m1.bind(function(v1) {
            return m2.bind(function(v2) {
                return monad(function(transformFn) {
                    return transformFn(v1, v2);
                });
            });
        });
    }
});
