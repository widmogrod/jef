define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Function} fn
     * @param {Stream} stream
     * @return {Stream}
     */
    return function filter(fn, stream) {
        return new Stream(function(sink) {
            stream.on(function(value, next) {
                if (fn(value)) {
                    sink(
                        value,
                        Stream.streamable(next)
                            ? filter(fn, next)
                            : Stream.stop
                    );

                    return Stream.stop;
                }
            });
        })
    }
});
