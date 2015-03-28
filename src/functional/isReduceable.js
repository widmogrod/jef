define(function () {
    'use strict';

    /**
     * Check if is possible to call reduce function on value.
     *
     * @param {{reduce:function}} value
     * @return {Boolean}
     */
    return function isReduceable(value) {
        return value && typeof value.reduce === 'function';
    }
});
