define(function () {
    'use strict';

    /**
     * Check if is possible to call filter function on value.
     *
     * @param {{filter:function}} value
     * @return {Boolean}
     */
    return function isFilterable(value) {
        return value && typeof value.filter === 'function';
    }
});
