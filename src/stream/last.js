define(['./stream', '../functional/isDefined'], function (Stream, isDefined) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function last(stream) {
        var lastValue;

        stream.on(function(value) {
            lastValue = value;
            return Stream.stop;
        });

        return new stream.constructor(function(sinkValue, sinkError, sinkComplete) {
            if (isDefined(lastValue)) {
                sinkValue(lastValue);
            }

            stream.on(function (value) {
                lastValue = value;
                sinkValue(value);
            }, sinkError, function () {
                sinkComplete();
            });
        });
    };
});
