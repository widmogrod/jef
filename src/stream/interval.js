define(['./stream', '../functional/isDefined'], function(Stream, isDefined) {
    'use strict';

    /**
     * Emit signal every ms
     *
     * @param {Number} ms
     * @param {Number} times
     * @return {Stream}
     */
    return function interval(ms, times) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            var time = 0;

            var id = setInterval(function() {
                ++time;

                if (isDefined(times) && times <= time) {
                    clearInterval(id);
                    sinkValue(time);
                    sinkComplete();
                } else {
                    sinkValue(time);
                }
            }, ms);
        });
    };
});
