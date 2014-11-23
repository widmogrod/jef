
define(function () {
    'use strict';

    /**
     * Check if object has its own property
     *
     * @param  {[type]}  key
     * @return {Boolean}
     */
    return function has(key) {
        return function (obj) {
            return obj.hasOwnProperty(key);
        }
    }
});
