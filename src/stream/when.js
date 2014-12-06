define(['./stream', '../functional/each', '../functional/immediate'], function(Stream, each, immediate, undefined) {
    'use strict';

    /**
     * @param {Stream[]} streams
     * @param {Array} [buffer]
     * @return {Stream}
     */
    return function when(streams, buffer) {
        buffer = buffer || new Array(streams.length);
        return new Stream(function(sinkValue, sinkError) {
            each(streams, function(stream, index) {
                buffer[index] = undefined;

                stream.on(function(value) {
                    immediate(function() {
                        buffer[index] = value;

                        if (-1 === buffer.indexOf(undefined)) {
                            sinkValue(buffer, when(streams, buffer));
                        } else {
                            when(streams, buffer);
                        }
                    });

                    return Stream.stop;
                }, function(error) {
                    sinkError(error);
                }, function() {
                    sinkValue(undefined, Stream.stop);
                })
            });
        })
    }
});
