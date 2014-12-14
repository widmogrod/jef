define(['./stream', './both'], function(Stream, both) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function concat(stream) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value, next) {
                if (Stream.streamable(value)) {
                    concat(both(value, next)).on(function(value, inner) {
                        sinkValue(
                            value,
                            inner
                        );

                        return Stream.stop;
                    }, sinkError);
                } else {
                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? concat(next)
                            : Stream.stop
                    );
                }

                return Stream.stop;
            }, sinkError);
        })
    }
});
