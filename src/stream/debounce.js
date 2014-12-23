define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} wait
     * @return {Stream}
     */
    return function debounce(stream, wait) {
        return new stream.constructor(function(sinkValue, sinkError) {
            var timeout;
            stream.on(function(value, next) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function() {
                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? debounce(next, wait)
                            : Stream.stop
                    )
                }, wait);

            }, sinkError);
        });
    };
});
