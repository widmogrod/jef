define(['./stream'], function(Stream) {
    'use strict';

    /**
     * Convert eventEmitter to stream.
     *
     * @param {{on: Function}} eventEmitter
     * @param {String} selector
     * @param {String} event
     * @return {Stream}
     */
    return function fromEmitter(eventEmitter, selector, event) {
        var __sinkValue, stream;

        function onEmitted(e) {
            __sinkValue && __sinkValue(e, stream)
        }

        stream = new Stream(function(sinkValue) {
            __sinkValue = sinkValue;
        });

        eventEmitter.on(event, selector, onEmitted);

        return stream;
    }
});
