define(['./stream', '../functional/immediate'], function(Stream, immediate) {
    'use strict';

    /**
     * Stream values form streamA until streamB don't emmit anything
     *
     * @param {Stream} streamA
     * @param {Stream} streamB
     * @return {Stream}
     */
    return function until(streamA, streamB) {
        var active = true;

        return new Stream(function (sinkValue, sinkError, sinkComplete) {
            immediate(function() {
                streamB.on(function() {
                    active = false;
                    sinkComplete();
                    return Stream.stop;
                }, sinkComplete, sinkComplete);

                streamA.on(function (value) {
                    if (active) {
                        return sinkValue(value);
                    }
                }, sinkError, sinkComplete);
            });
        });
    };
});
