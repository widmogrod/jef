define(['./slice'], function(slice) {
    'use strict';

    /**
     * Curry function
     *
     * @param {Number} n Arity
     * @param {Function} fn
     * @param {*} thisArgs
     * @param {Array} initArgs
     * @return {Function}
     */
    return function curryN(n, fn, thisArgs, initArgs) {
        initArgs = initArgs || [];
        return function curriedN() {
            var args = initArgs.concat(slice(arguments)),
                len = args.length;

            if (n <= len) {
                return fn.apply(thisArgs, args);
            } else {
                return curryN(n - len, fn, thisArgs, args)
            }
        };
    };
});
