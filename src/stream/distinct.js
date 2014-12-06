define(['./stream', './streamable'], function(Stream, streamable) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {*} lastValue
     * @return {Stream}
     */
    return function distinct(stream, lastValue) {
        return new Stream(function(sink) {
            stream.on(function(value, next) {
                if (lastValue !== value) {
                    sink(
                        value,
                        streamable(next)
                            ? distinct(next, value)
                            : Stream.stop
                    );

                    return Stream.stop;
                }
            });
        })
    }
});
