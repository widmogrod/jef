define(['./stream', './both'], function(Stream, both) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function map(stream, fn) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                value = fn(value);
                next = Stream.streamable(next) ? map(next, fn) : Stream.stop;

                if (Stream.streamable(value)) {
                    value.on(function(value, nextinner) {
                        sinkValue(
                            value,
                            Stream.streamable(nextinner)
                                ? both(nextinner, next)
                                : next
                        );

                        return Stream.stop;
                    });
                } else {
                    sinkValue(value, next);
                }

                return Stream.stop;
            }, sinkError);
        })
    }
});
