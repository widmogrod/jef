define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Number} wait
     * @param {Stream} stream
     * @return {Stream}
     */
    return function debounce(wait, stream) {
        return new Stream(function(sink) {
            var timeout;
            stream.on(function(value, next) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function() {
                    sink(
                        value,
                        Stream.streamable(next)
                            ? debounce(wait, next)
                            : Stream.stop
                    )
                }, wait)
            });
        })
    }
});
