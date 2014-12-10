define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function map(stream, fn) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                sinkValue(
                    fn(value),
                    Stream.streamable(next)
                        ? map(next, fn)
                        : Stream.stop
                );

                return Stream.stop;
            }, sinkError);
        })
    }
});
