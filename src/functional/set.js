
define(function () {
    'use strict';

    /**
     * Set param in object property
     *
     * @param  {[type]}  key
     * @return {Boolean}
     */
    return function set(key) {
        return function (obj) {
            return function (value) {
                obj[key] = value;
            };
        }
    }
});
