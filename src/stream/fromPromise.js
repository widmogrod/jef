define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Promise} promise
     * @return {Stream}
     */
    return function fromPromise(promise) {
        return new Stream(function(sinkValue, sinkError) {
            promise.then(function(value) {
                sinkValue(value, Stream.stop);
            }, function(e) {
                sinkError(e);
            });

            return Stream.stop;
        })
    }
});
