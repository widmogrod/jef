define(['./stream', '../functional/isDefined'], function(Stream, isDefined) {
    'use strict';

    function LastStream(implementation, onAttacheOnValue) {
        Stream.call(this, implementation);

        var on = this.on;

        this.on = function onLast(onValue, onError, onComplete) {
            if (Stream.continuable(onAttacheOnValue(onValue, onError))) {
                on(onValue, onError, onComplete);
            }
            return this;
        };
    }

    LastStream.constructor = LastStream;
    LastStream.prototype = Object.create(Stream.prototype);

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

        return new LastStream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                lastValue = value;
                return sinkValue(value);
            }, sinkError, sinkComplete);
        }, function onAttacheOnValue(onValue, onError) {
            if (isDefined(lastError)) {
                onError(lastError);
                return;
            }

            if (isDefined(lastValue)) {
                try {
                    return onValue(lastValue);
                } catch(e) {
                    return onError(e);
                }
            }
        });
    };
});
