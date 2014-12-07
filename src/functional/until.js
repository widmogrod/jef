define(['./apply'], function(apply) {
    'use strict';

    /**
     * Call functions until some condition
     *
     * @param {Function} condition
     * @param {Function} fn
     * @return {Function}
     */
    function until(condition, fn) {
        var partial = function() {
            if (condition && apply(condition, arguments)) {
                return apply(fn, arguments)
            } else {
                condition = fn = null;
            }
        };

        partial.isUntilPartial = true;

        return partial;
    }

    /**
     * @param {Function} fn
     * @returns {Boolean}
     */
    until.is = function (fn) {
        return fn && true === fn.isUntilPartial;
    };

    return until;
});
