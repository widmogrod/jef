define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {*} lastValue
     * @return {Stream}
     */
    return function distinct(stream, lastValue) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                if (lastValue !== value) {
                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? distinct(next, value)
                            : Stream.stop
                    );

                    return Stream.stop;
                }
            }, sinkError);
        })
    }
});
