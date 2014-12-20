define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function concat(stream) {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            stream.on(function(value) {
                if (Stream.streamable(value)) {
                    value.on(function(val) {
                        //console.log('val', val)
                        sinkValue(val);
                    }, sinkError);
                } else {
                    //console.log('else', value);
                    sinkValue(value);
                }
            }, sinkError, sinkComplete);
        });
    };
});
