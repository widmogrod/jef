define(['./apply'], function(apply) {
    'use strict';

    /**
     * Call functions until some condition
     *
     * @param {Function} condition
     * @param {Function} fn
     * @return {Function}
     */
    return function until(condition, fn) {
        return function until(a, b, c) {
            if (apply(condition, arguments)) {
                return apply(fn, arguments)
            }
        }
    }
});
