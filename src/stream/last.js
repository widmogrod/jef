define(['./stream', '../functional/isDefined'], function (Stream, isDefined, undefined) {
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

        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            if (isDefined(lastValue)) {
                sinkValue(lastValue);
            }

            stream.on(function (value) {
                if (!isDefined(lastValue)) {
                    sinkValue(value);
                }

                lastValue = value;
            }, sinkError, function () {
                lastValue = undefined;
                sinkComplete();
            });
        });
    };
});
