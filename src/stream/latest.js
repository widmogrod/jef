define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function latest(stream) {
        return new Stream(function(sinkValue, sinkError) {
            stream.on(function(value, next) {
                if (Stream.streamable(next)) {
                    latest(next).on(function(value, inner) {
                        sinkValue(value, inner);

                        return Stream.stop;
                    }, sinkError);
                } else {
                    sinkValue(value, Stream.stop);
                }

                return Stream.stop;
            }, sinkError);
        });
    }
});
