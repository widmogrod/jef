
define([
    './slice',
    './apply'
], function (slice, apply) {
    'use strict';

    /**
     * Memorize function call with arguments
     * @param  Function func
     * @return Function
     */
    return function memoize(func) {
        var cache = {};
        return function memorized() {
            var cacheKey = (arguments.length > 0)
                ? slice(arguments).join('::')
                : 'without_args';

            if (typeof cache[cacheKey] !== 'undefined') {
                return cache[cacheKey];
            }

            return cache[cacheKey] = apply(func, arguments);
        }
    }
});
