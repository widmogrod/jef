define(['./stream', '../functional/isDefined'], function (Stream, isDefined) {
    'use strict';

    /**
     * @param {Function} destroy
     * @constructor
     */
    function PushStream(destroy) {
        var __sinkNext, __sinkError, __sinkComplete, self = this;

        Stream.call(this, function(sinkNext, sinkError, sinkComplete) {
            __sinkNext = sinkNext;
            __sinkError = sinkError;
            __sinkComplete = sinkComplete;
        });

        this.push = function push(value, error) {
            if (isDefined(error) && __sinkError) {
                if (!Stream.streamable(__sinkError(error, self))) {
                    destroy();
                    __sinkNext = __sinkError = __sinkComplete = null;
                }
            } else if (isDefined(value) && __sinkNext) {
                __sinkNext(value, self);
            } else if (__sinkComplete) {
                destroy();
                __sinkComplete();
                __sinkNext = __sinkError = __sinkComplete = null;
            }
        };
    }

    PushStream.constructor = PushStream;
    PushStream.prototype = Object.create(Stream.prototype);

    return PushStream;
});
