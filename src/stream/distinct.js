define(function () {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {*} lastValue
     * @return {Stream}
     */
    return function distinct(stream) {
        var lastValue;
        return new stream.constructor(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                if (lastValue !== value) {
                    sinkValue(value);
                    lastValue = value;
                }
            }, sinkError, sinkComplete);
        });
    };
});
