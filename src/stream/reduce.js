define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @param {*} base
     * @return {Stream}
     */
    return function reduce(stream, fn, base) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                base = fn(value, base);
                if (!Stream.streamable(next)) {
                    sinkValue(base, next);
                }
            }, sinkError);
        })
    }
});
