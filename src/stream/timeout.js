define(['./stream'], function (Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} [wait]
     * @return {Stream}
     */
    return function timeout(stream, wait) {
        var called = 0;
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                called++;
                setTimeout(function() {
                    sinkValue(value);
                    if (!--called) {
                        sinkComplete();
                    }
                }, wait);
            }, sinkError);
        });
    };
});
