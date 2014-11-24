define([
    './stream'
], function(Stream) {
    'use strict';

    /**
     * Map stream over a function
     *
     * @param {StreamInterface} stream
     * @param {Function} func
     * @constructor
     */
    function MapStream(stream, func) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            self.push(func(value));
        }
        function onError(error) {
            self.push.error(error);
            stream.off(onValue, onError, onComplete);
        }
        function onComplete() {
            self.push.complete();
            stream.off(onValue, onError, onComplete);
        }

        stream.on(onValue, onError, onComplete);
    }

    MapStream.prototype = Object.create(Stream.prototype);

    return MapStream;
});
