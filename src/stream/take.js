define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} n
     * @return {Stream}
     */
    return function take(stream, n) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                sinkValue(
                    value,
                    n > 1
                        ? take(next, n -1)
                        : Stream.stop
                );

                return Stream.stop;
            }, sinkError);
        })
    }
});
