define(['./map', '../functional/pluck'], function (map, fpluck) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {String} pattern
     * @return {Stream}
     */
    return function pluck(stream, pattern) {
        return map(stream, fpluck(pattern))
    };
});
