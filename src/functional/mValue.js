
define(function () {
    'use strict';

    /**
     * Return monadic value
     * Example: mv(1) -> f() -> 1
     */
    return function mValue(value) {
        return function () {
            return value;
        }
    }
});
