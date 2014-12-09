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
    return function when(streams, buffer, completed) {
        buffer = buffer || new Array(streams.length);
        completed = completed || new Array(streams.length);

        return new Stream(function whenInit(sinkValue, sinkError, sinkComplete) {
            each(streams, function(stream, index) {
                Stream.streamable(stream) && stream.on(function(value, next) {
                    buffer[index] = value;
                    streams[index] = next;

                    if (!contains(buffer, undefined)) {
                        sinkValue(
                            clone(buffer),
                            Stream.streamable(next)
                                ? when(streams, buffer, completed)
                                : Stream.stop
                        );

                        return Stream.stop;
                    }

                }, sinkError, function() {
                    completed[index] = true;
                    if (!contains(completed, undefined)) {
                        sinkComplete();
                        // clear reference
                        completed = buffer = streams = null;
                    }
                })
            });
        })
    }
});
