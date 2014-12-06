define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} streamA
     * @param {Stream} streamB
     * @return {Stream}
     */
    return function both(streamA, streamB) {
        return new Stream(function(sink) {
            streamA.on(function(value, next) {
                sink(
                    value,
                    Stream.streamable(next)
                        ? both(next, streamB)
                        : streamB
                );

                return Stream.stop;
            }, function(e) {
                throw e
            });
        });
    }
});
