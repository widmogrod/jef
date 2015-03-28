define(function () {
    'use strict';

    /**
     * Check if is possible to call map function on value.
     *
     * @param {{map:function}} value
     * @return {Boolean}
     */
    return function isMapable(value) {
        return value && typeof value.map === 'function';
    }
});
