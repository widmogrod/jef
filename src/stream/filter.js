define([
    './stream'
], function(Stream) {
    'use strict';

    /**
     * Filter stream over a function
     *
     * @param {StreamInterface} stream
     * @param {Function} func
     * @constructor
     */
    function FilterStream(stream, func) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            func(value) && self.push(value);
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

    FilterStream.prototype = Object.create(Stream.prototype);

    return FilterStream;
});
