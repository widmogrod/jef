define(['../functional/isFunction'], function(isFunction) {
    'use strict';

    /**
     * @param {Function} fn
     * @param {Error} e
     * @param {Stream} next
     * @return {*}
     * @throws
     */
    return function callIfOrThrow(fn, e, next) {
        if (isFunction(fn)) {
            return fn(e, next);
        }

        throw e;
    }
});
