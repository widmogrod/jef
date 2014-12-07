define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Element} element
     * @param {String} eventName
     * @return {Stream}
     */
   return function fromEvent(element, eventName) {
        return new Stream(function(sinkValue) {
            var sinkEvent;

            sinkEvent = function(e) {
                element.removeEventListener(eventName, sinkEvent, false);

                sinkValue(e, fromEvent(element, eventName));

                element = sinkEvent = sinkValue =  eventName = null;
            };

            element.addEventListener(eventName, sinkEvent, false);
        });
    }
});
