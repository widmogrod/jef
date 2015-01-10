define([
    './stream',
    './noop',
    '../functional/each',
    '../functional/contains'
], function(Stream, noop, each, contains, undefined) {
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
                stream.on(function(value) {
                    buffer[index] = value;

                    if (!contains(buffer, undefined)) {
                        sinkValue(buffer.slice(0));
                    }

                }, sinkError, function() {
                    completed[index] = true;
                    if (!contains(completed, undefined)) {
                        sinkComplete();
                        // clear reference
                        completed = buffer = streams = null;
                    }
                });
            });
        });
    };
});
