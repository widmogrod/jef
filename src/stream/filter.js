define(function () {
    'use strict';

    /**
     * Filter stream values, and accept only those that pass test function
     *
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function filter(stream, fn) {
        return new stream.constructor(function (sinkValue, sinkError, sinkComplete) {
            stream.on(function (value) {
                if (fn(value)) {
                    sinkValue(
                        value
                    );
                }

            }, sinkError, sinkComplete);
        });
    };
});
