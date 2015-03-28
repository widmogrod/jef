define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} streamA
     * @param {Stream} streamB
     * @return {Stream}
     */
    return function both(streamA, streamB) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            streamA.on(function(value) {
                return sinkValue(value);
            }, sinkError, function() {
                streamB.on(function(value) {
                    return sinkValue(value);
                }, sinkError, sinkComplete);
            });
        });
    };
});
