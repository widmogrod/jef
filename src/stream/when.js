define([
    './stream',
    './noop',
    '../functional/each',
    '../functional/contains',
    '../functional/clone'
], function(Stream, noop, each, contains, clone, undefined) {
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
                Stream.streamable(stream) && stream.on(function(value, next) {
                    buffer[index] = value;
                    streams[index] = next;

                    if (!contains(buffer, undefined)) {
                        sinkValue(
                            clone(buffer),
                            Stream.streamable(next)
                                ? when(streams, buffer)
                                : Stream.stop
                        );

                        return Stream.stop;
                    }

                }, sinkError)
            });
        })
    }
});
