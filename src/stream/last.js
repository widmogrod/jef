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
                var result = sinkValue(lastValue);
                if (!Stream.continuable(result)) {
                    // Don't continue when onValue callback stops streaming
                    return result;
                }
            }

            if (isDefined(lastError)) {
                // Don't continue when prefetched value was an error
                return sinkError(lastError, lastNext);
            }

            stream.on(function(value) {
                lastValue = value;
                return sinkValue(value);
            }, sinkError, sinkComplete);
        });
    };
});
