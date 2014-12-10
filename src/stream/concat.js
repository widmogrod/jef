define(['./stream', './both'], function(Stream, both) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function concat(stream) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                if (Stream.streamable(value)) {
                    concat(both(value, next)).on(function(value, inner) {
                        sinkValue(
                            value,
                            concat(inner)
                        );
                    });
                } else {
                    sinkValue(value, concat(next));
                }

                return Stream.stop;
            }, sinkError);
        })
    }
});
