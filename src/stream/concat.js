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
                if (--started) {
                    callback.apply(null, arguments)
                }
            }
        }

        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            var tryComplete = complete(sinkComplete);

            stream.on(function(value) {
                ++started;
                if (Stream.streamable(value)) {
                    value.on(function(val) {
                        sinkValue(val);
                    }, sinkError, tryComplete);
                } else {
                    sinkValue(value);
                    tryComplete();
                }
            }, sinkError, tryComplete);
        });
    };
});
