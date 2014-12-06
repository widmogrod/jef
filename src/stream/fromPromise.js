define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Promise} promise
     * @return {Stream}
     */
    return function fromPromise(promise) {
        return new Stream(function(sink) {
            promise.then(function(value) {
                sink(value, Stream.stop);
            }, function(e) {
                throw e
            });

            return Stream.stop;
        })
    }
});
