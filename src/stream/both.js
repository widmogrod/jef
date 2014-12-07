define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} streamA
     * @param {Stream} streamB
     * @return {Stream}
     */
    return function both(streamA, streamB) {
        return new Stream(function(sinkValue, sinkError) {
            streamA.on(function(value, next) {
                sinkValue(
                    value,
                    Stream.streamable(next)
                        ? both(next, streamB)
                        : streamB
                );

                return Stream.stop;
            }, sinkError);
        });
    }
});
