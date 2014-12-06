define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {*} value
     * @return {Boolean}
     */
    return function streamable(value) {
        console.log('value:', value, 'strea', Stream);
        return value instanceof Stream;
    }
});
