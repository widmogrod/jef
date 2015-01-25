define(['./stream'], function (Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} [wait]
     * @return {Stream}
     */
    return function timeout(stream, wait) {
        var called = 0, completeInterval;
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                called++;
                setTimeout(function() {
                    sinkValue(value);
                    --called;
                }, wait);
            }, sinkError, function() {
                if (!called) {
                    return sinkComplete();
                }

                // Wait for complete
                completeInterval = setInterval(function() {
                    if (!called) {
                        sinkComplete();
                        clearInterval(completeInterval);
                    }
                }, wait);
            });
        });
    };
});
