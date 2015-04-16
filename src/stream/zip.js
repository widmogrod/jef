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
            buffer = [],
            maxLevel = null,
            completed = new Array(len);

        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            each(streams, function(stream, index) {
                var next = 0;
                stream.on(function(value) {
                    var current = next++;

                    if (null !== maxLevel && current > maxLevel) {
                        return Stream.stop;
                    }

                    buffer[current] = buffer[current] || new Array(len);
                    buffer[current][index] = value;

                    if (!contains(buffer[current], undefined)) {
                        sinkValue(buffer[current]);
                        delete buffer[current];
                    }
                }, sinkError, function() {
                    completed[index] = next;
                    maxLevel = Math.min.apply(null, completed);
                    if (!contains(completed, undefined)) {
                        sinkComplete();
                        // clear reference
                        completed = buffer = streams = next = len = maxLevel = null;
                    }
                });
            });
        });
    };
});
