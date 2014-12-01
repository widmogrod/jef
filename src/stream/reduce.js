define([
    './stream'
], function(Stream) {
    'use strict';

    /**
     * Reduce stream over a function
     *
     * @param {StreamInterface} stream
     * @param {Function} func
     * @param {*} base
     * @constructor
     */
    function ReduceStream(stream, func, base) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            self.push(base = func(value, base));
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

    ReduceStream.prototype = Object.create(Stream.prototype);

    return ReduceStream;
});
