define([
    './stream',
    '../functional/apply',
    '../functional/invoke'
], function(Stream, apply, invoke) {
    'use strict';

    /**
     * When events occur, push and accumulated value
     *
     * @param {StreamInterface[]} streams
     * @constructor
     */
    function WhenStream(streams) {
        var self = this, push = self.push.bind(this);

        var buffer = new Array(streams.length);
        var called = new Array(streams.length);

        Stream.call(self);

        streams.forEach(function(stream, index) {
            called[index] = false;

            function onValue(value) {
                called[index] = true;
                buffer[index] = value;

                if (-1 === called.indexOf(false)) {
                    apply(push, [buffer]);
                }
            }

            function onError(error) {
                self.push.error(error);
                invoke(stream, 'off', onValue, onError, onComplete);
            }

            function onComplete() {
                self.push.complete();
                invoke(stream, 'off', onValue, onError, onComplete);
            }

            stream.on(onValue, onError, onComplete);
        });
    }

    WhenStream.constructor = WhenStream;
    WhenStream.prototype = Object.create(Stream.prototype);

    return WhenStream;
});
