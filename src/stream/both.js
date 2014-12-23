define(function() {
    'use strict';

    /**
     * @param {Stream} streamA
     * @param {Stream} streamB
     * @return {Stream}
     */
    return function both(streamA, streamB) {
        return new streamA.constructor(function(sinkValue, sinkError, sinkComplete) {
            streamA.on(function(value) {
                sinkValue(value);
            }, sinkError, function() {
                streamB.on(function(value) {
                    sinkValue(value);
                }, sinkError, sinkComplete);
            });
        });
    };
});
