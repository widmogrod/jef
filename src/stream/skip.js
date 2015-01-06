define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} n
     * @return {Stream}
     */
    return function skip(stream, n) {
        return new Stream(function (sinkValue, sinkError, sinkComplete) {
            stream.on(function (value) {
                if (!n) {
                    return sinkValue(value);
                } else {
                    --n;
                }

            }, sinkError, sinkComplete);
        });
    };
});
