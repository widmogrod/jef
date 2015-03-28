define(function () {
    'use strict';

    /**
     * Check if is possible to call forEach function on value.
     *
     * @param {{forEach:function}} value
     * @return {Boolean}
     */
    return function isForEachable(value) {
        return value && typeof value.forEach === 'function';
    }
});
