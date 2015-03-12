define(function() {
    'use strict';

    /**
     * Check whenever value is a thenable or not.
     *
     * @param {{then:function}} value
     * @return {Boolean}
     */
    return function isThenable(value) {
        return value && typeof value.then === 'function';
    }
});
