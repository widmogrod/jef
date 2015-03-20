define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function concat(stream) {
        var started = 0;

        function complete(callback) {
            return function tryComplete() {
                if (--started < 0) {
                    callback();
                }
            }
        }

        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            var tryComplete = complete(sinkComplete);

            stream.on(function(value) {
                if (Stream.streamable(value)) {
                    ++started;
                    value.on(function(val) {
                        sinkValue(val);
                    }, sinkError, tryComplete);
                } else {
                    sinkValue(value);
                }
            }, sinkError, tryComplete);
        });
    };
});
