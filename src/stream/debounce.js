define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Number} wait
     * @param {Stream} stream
     * @return {Stream}
     */
    return function debounce(wait, stream) {
        return new Stream(function(sinkValue, sinkError) {
            var timeout;
            stream.on(function(value, next) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function() {
                    timeout = null;

                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? debounce(wait, next)
                            : Stream.stop
                    )
                }, wait)

            }, sinkError);
        })
    }
});
