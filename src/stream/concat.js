define([
    './stream',
    '../functional/each',
    '../functional/isArray'
], function(Stream, each, isArray) {
    'use strict';

    /**
     * Concatenate result of the stream.
     *
     * @param {StreamInterface} stream
     * @constructor
     */
    function ConcatStream(stream) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            if (isArray) {
                each(value, self.push.bind(self));
            } else {
                self.push(value);
            }
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

    ConcatStream.constructor = ConcatStream;
    ConcatStream.prototype = Object.create(Stream.prototype);

    return ConcatStream;
});
