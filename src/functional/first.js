
define([
    './get'
], function (get) {
    'use strict';

    /**
     * Return first element from array
     */
    return function first(array) {
        return get(0)(array);
    }
});
