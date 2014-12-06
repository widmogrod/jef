define(function() {
    'use strict';

    /**
     * @param {Function} fn
     * @return {Function}
     */
    return function once(fn) {
        var called = false;
        return function(a, b, c) {
            if (!called) {
                called = true;
                fn(a, b, c);
                fn = null;
            }
        }
    }
});
