define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function map(stream, fn) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                sinkValue(
                    fn(value)
                );
            }, sinkError, sinkComplete);
        });
    };
});
