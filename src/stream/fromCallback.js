define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Function} callback
     * @return {Stream}
     */
    return function fromCallback(callback) {
        return new Stream(function(sinkValue, sinkError) {
            try {
                return sinkValue(callback(), Stream.stop);
            } catch(e) {
                sinkError(e);
            }
        });
    };
});
