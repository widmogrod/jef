define(['./stream'], function(Stream) {
    'use strict';

    /**
     * Filter stream values, and accept only those that pass test function
     *
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function filter(stream, fn) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value, next) {
                if (fn(value)) {
                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? filter(next, fn)
                            : Stream.stop
                    );

                    return Stream.stop;
                }
            }, sinkError, sinkComplete);
        })
    }
});
