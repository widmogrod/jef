define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} [wait]
     * @return {Stream}
     */
    return function timeout(stream, wait) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                setTimeout(function() {
                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? timeout(next, wait)
                            : Stream.stop
                    );
                }, wait | 0);

                return Stream.stop;
            }, sinkError);
        })
    }
});
