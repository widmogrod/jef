define(['../functional/isFunction'], function(isFunction) {
    'use strict';

    /**
     * @param {Function} fn
     * @return {*}
     */
    return function callIfCallable(fn) {
        return isFunction(fn) ? fn() : null;
    };
});
