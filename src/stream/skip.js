define(function () {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} n
     * @return {Stream}
     */
    return function skip(stream, n) {
        return new stream.constructor(function (sinkValue, sinkError, sinkComplete) {
            stream.on(function (value) {
                if (!n) {
                    sinkValue(value);
                } else {
                    --n;
                }

            }, sinkError, sinkComplete);
        });
    };
});
