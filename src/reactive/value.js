
define(function () {
    'use strict';

    /**
     * Base function for storing, retrieving variables
     */
    return function value(v) {
        return function (set) {
            if (arguments.length) {
                v = set;
                return this;
            }
            return v;
        }
    }
});
