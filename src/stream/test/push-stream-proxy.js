define([
    './../push-stream',
    './stream-proxy'
], function (PushStream, StreamTestProxy) {
    'use strict';

    /**
     * Create proxy to a push stream that collect useful information
     * used during tests
     *
     * @param {PushStream} stream
     * @constructor
     */
    return function PushStreamTestProxy(stream) {
        StreamTestProxy.call(this, stream);

        var self = this;
        self.called.push = 0;

        this.push = function(value) {
            ++self.called.push;
            stream.push(value);
        };
    };
});
