define([
    './stream',
    '../functional/each',
    '../functional/contains'
], function(Stream, each, contains, undefined) {
    'use strict';

    /**
     * @param {Stream[]} streams
     * @return {Stream}
     */
    return function zip(streams) {
        var len = streams.length,
            buffer =  new Array(len),
            completed = false;

        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            each(streams, function(stream, index) {
                var next = 0;
                stream.on(function(value) {
                    var current = next++;

                    if (false !== completed) {
                        return sinkComplete();
                    }

                    buffer[index] = buffer[index] || new Array(len);
                    buffer[index][current] = value;

                    if (!contains(buffer[index][current], undefined)) {
                        current = buffer[index];
                        delete buffer[index];
                        sinkValue(current);
                    }
                }, sinkError, function() {
                    sinkComplete();
                    // clear reference
                    completed = buffer = streams = next = null;
                });
            });
        });
    };
});
