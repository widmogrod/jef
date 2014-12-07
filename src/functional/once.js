define(function() {
    'use strict';

    /**
     * @param {Function} fn
     * @return {Function}
     */
    return function once(fn) {
        var called = false, result;
        return function(a, b, c) {
            if (!called) {
                called = true;
                result = fn(a, b, c);
                fn = null;
            }

            return result;
        }
    }
});
