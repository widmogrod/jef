
define(function () {
    'use strict';

    /**
     * Evaluate function only when value is defined
     */
    return function maybe(value, fn) {
        return value === null || value === undefined ? value : fn(value);
    }
});
