define([
    './decorator/on-attach-decorator',
    '../functional/isDefined'
], function(StreamOnAttachDecorator, isDefined) {
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
        }, function(error, next) {
            lastError = error;
            lastNext = next;
        }, function() {
            lastComplete = true;
        });

        return new StreamOnAttachDecorator(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                sinkValue(value);
            }, sinkError, sinkComplete);
        }, function onAttacheOnValue(onValue, onError, onComplete) {
            if (isDefined(lastError)) {
                onError(lastError, lastNext);
                return;
            }

            if (isDefined(lastComplete)) {
                onComplete();
                return;
            }

            if (isDefined(lastValue)) {
                try {
                    return onValue(lastValue);
                } catch (e) {
                    return onError(e, lastNext);
                }
            }
        });
    };
});
