define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} n
     * @return {Stream}
     */
    return function skip(stream, n) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                if (n && Stream.streamable(next)) {
                    skip(
                        next,
                        n - 1
                    ).on(function(value, next) {
                        sinkValue(value, next);
                        return Stream.stop;
                    });
                } else if (n === 0) {
                    sinkValue(
                        value,
                        next
                    );
                }

                return Stream.stop;
            }, sinkError);
        })
    }
});
