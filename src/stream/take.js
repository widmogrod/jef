define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} n
     * @return {Stream}
     */
    return function take(stream, n) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                if (n--) {
                    return sinkValue(
                        value,
                        n < 1
                            ? Stream.stop
                            : null
                    );
                }

                if (n < 1) {
                    sinkComplete();
                    return Stream.stop;
                }

            }, sinkError, sinkComplete);
        });
    };
});
