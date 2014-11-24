define([
    './stream'
], function(Stream) {
    'use strict';

    /**
     * Forward parent stream until an event occur in an until stream
     *
     * @param {StreamInterface} stream
     * @param {StreamInterface} until
     * @constructor
     */
    function UntilStream(stream, until) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            self.push(value);
        }
        function onError(error) {
            self.push.error(error);
            stream.off(onValue, onError, onComplete);
            until.off(onValue, onError, onComplete);
        }
        function onComplete() {
            self.push.complete();
            stream.off(onValue, onError, onComplete);
            until.off(onValue, onError, onComplete);
        }

        stream.on(onValue, onError, onComplete);
        until.on(onComplete, onError, onComplete);
    }

    UntilStream.constructor = UntilStream;
    UntilStream.prototype = Object.create(Stream.prototype);

    return UntilStream;
});
