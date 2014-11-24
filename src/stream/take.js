define([
    './stream'
], function(Stream) {
    'use strict';

    /**
     * Take only part of the stream
     *
     * @param {StreamInterface} stream
     * @param {Number} take
     * @constructor
     */
    function TakeStream(stream, take) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            if (take) {
                --take;
                self.push(value);
            }

            if (take < 1) {
                self.push.complete();
                stream.off(onValue, onError, onComplete);
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

    TakeStream.constructor = TakeStream;
    TakeStream.prototype = Object.create(Stream.prototype);

    return TakeStream;
});
