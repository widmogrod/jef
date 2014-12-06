define(['./stream', './both'], function(Stream, both) {
    'use strict';

    /**
     * @param {Function} fn
     * @param {Stream} stream
     * @return {Stream}
     */
    return function map(fn, stream) {
        return new Stream(function(sink) {
            stream.on(function(value, next) {
                value = fn(value);
                next = Stream.streamable(next) ? map(fn, next) : Stream.stop;

                if (Stream.streamable(value)) {
                    value.on(function(value, nextinner) {
                        sink(
                            value,
                            Stream.streamable(nextinner)
                                ? both(nextinner, next)
                                : next
                        );

                        return Stream.stop;
                    });
                } else {
                    sink(value, next);
                }

                return Stream.stop;
            });
        })
    }
});
