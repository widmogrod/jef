define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @param {*} base
     * @return {Stream}
     */
    return function reduce(stream, fn, base) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                base = fn(base, value);
            }, sinkError, function() {
                sinkValue(base);
                sinkComplete();
            });
        });
    };
});
