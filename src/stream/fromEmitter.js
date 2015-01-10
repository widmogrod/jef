define(['./push-stream', '../functional/noop'], function(PushStream, noop) {
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

        stream = new PushStream();

        function onEmitted(e) {
            stream.push(e);
        }

        eventEmitter.on(event, selector, onEmitted);

        stream.on(noop, noop, function() {
            eventEmitter.off(event, selector, onEmitted);
        });

        return stream;
    };
});
