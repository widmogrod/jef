define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Element} element
     * @param {String} eventName
     * @return {Stream}
     */
   return function fromEvent(element, eventName) {
        return new Stream(function(sink) {
            var sinkEvent;

            sinkEvent = function(e) {
                element.removeEventListener(eventName, sinkEvent);
                sink(e, fromEvent(element, eventName))
            };

            element.addEventListener(eventName, sinkEvent);
        });
    }
});
