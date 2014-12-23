define(function() {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function map(stream, fn) {
        return new stream.constructor(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                sinkValue(
                    fn(value)
                );
            }, sinkError, sinkComplete);
        });
    };
});
