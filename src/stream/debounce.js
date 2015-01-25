define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Number} wait
     * @return {Stream}
     */
    return function debounce(stream, wait) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            var timeout, completeInterval;
            stream.on(function(value) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function() {
                    sinkValue(value);
                }, wait);

            }, sinkError, function() {
                if (!timeout) {
                    return sinkComplete();
                }

                completeInterval = setInterval(function() {
                    if (!timeout) {
                        clearInterval(completeInterval);
                        sinkComplete();
                    }
                }, wait);

            });
        });
    };
});
