define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Number} n
     * @param {Stream} stream
     * @return {Stream}
     */
    return function take(n, stream) {
        return new Stream(function(sinkValue) {
            stream.on(function(value, next) {
                sinkValue(
                    value,
                    n > 1
                        ? take(n - 1, next)
                        : Stream.stop
                );

                return Stream.stop;
            });
        })
    }
});
