
define(function () {
    'use strict';

    /**
     * Slice arguments
     */
    return function slice(args, begin, end) {
        return Array.prototype.slice.call(args, begin, end);
    }
});
