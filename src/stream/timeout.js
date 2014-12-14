define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} [wait]
     * @return {Stream}
     */
    return function timeout(stream, wait) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            var id;
            stream.on(function(value, next) {
                id = setTimeout(function() {
                    sinkValue(
                        value,
                        Stream.streamable(next)
                            ? timeout(next, wait)
                            : Stream.stop
                    );
                }, wait | 0);

                return Stream.stop;
            }, function(e, next) {
                id && clearTimeout(id);
                sinkError(e, next);
            }, function() {
                id && clearTimeout(id);
                sinkComplete();
            });
        })
    }
});
