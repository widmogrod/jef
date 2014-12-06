define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {*} value
     * @return {Boolean}
     */
    return function continuable(value) {
        return value !== Stream.stop;
    }
});
