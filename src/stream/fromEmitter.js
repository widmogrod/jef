define(['./push-stream'], function(PushStream) {
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
        var stream;

        stream = new PushStream(function() {
            eventEmitter.off(event, selector, onEmitted);
        });

        function onEmitted(e) {
            stream.push(e);
        }

        eventEmitter.on(event, selector, onEmitted);

        return stream;
    };
});
