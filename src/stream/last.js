define([
    './stream',
    '../functional/isFunction'
], function(Stream, isFunction) {
    'use strict';

    /**
     * Last stream over a function
     *
     * @param {StreamInterface} stream
     * @param {Function} func
     * @param {*} base
     * @constructor
     */
    function LastStream(stream) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            self.push(value);
            self.__last__ = value;
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

    LastStream.prototype = Object.create(Stream.prototype);
    LastStream.prototype.on = function(onValue, onError, onComplete) {
        Stream.prototype.on.call(this, onValue, onError, onComplete);

        isFunction(onValue) && onValue(this.__last__);
    };

    return LastStream;
});
