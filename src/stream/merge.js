define([
    './stream'
], function(Stream) {
    'use strict';

    /**
     * Merge two stream into one
     *
     * @param {StreamInterface} streamA
     * @param {StreamInterface} streamB
     * @constructor
     */
    function MergeStream(streamA, streamB) {
        var self = this;

        Stream.call(self);

        function onValue(value) {
            self.push(value);
        }
        function onError(error) {
            self.push.error(error);
            streamA.off(onValue, onError, onComplete);
            streamB.off(onValue, onError, onComplete);
        }
        function onComplete() {
            self.push.complete();
            streamA.off(onValue, onError, onComplete);
            streamB.off(onValue, onError, onComplete);
        }

        streamA.on(onValue, onError, onComplete);
        streamB.on(onValue, onError, onComplete);
    }

    MergeStream.prototype = Object.create(Stream.prototype);

    return MergeStream;
});
