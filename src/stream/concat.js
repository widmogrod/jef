define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function concat(stream) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                if (Stream.streamable(value)) {
                    value.on(function(val) {
                        sinkValue(val);
                    }, sinkError);
                } else {
                    sinkValue(value);
                }
            }, sinkError, sinkComplete);
        });
    };
});
