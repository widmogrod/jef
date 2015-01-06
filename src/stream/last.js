define(['./stream', '../functional/isDefined'], function(Stream, isDefined) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function last(stream) {
        var lastValue, lastError, lastComplete, lastNext;

        // Prefetch last value
        stream.on(function(value, next) {
            lastValue = value;
            lastNext = next;
            return Stream.stop;
        }, function(error, next) {
            lastError = error;
            lastNext = next;
        }, function() {
            lastComplete = true;
        });

        //return new stream.constructor(function(sinkValue, sinkError, sinkComplete) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            if (isDefined(lastValue)) {
                if (!Stream.continuable(sinkValue(lastValue))) {
                    // Don't continue when onValue callback stops streaming
                    return;
                }
            }

            if (isDefined(lastError)) {
                // Don't continue when prefetched value was an error
                sinkError(lastError, lastNext);
                return;
            }

            stream.on(function(value) {
                lastValue = value;
                sinkValue(value);
            }, sinkError, sinkComplete);
        });
    };
});
