define(['./stream', '../functional/isDefined', '../functional/invoke'], function (Stream, isDefined, invoke, undefined) {
    'use strict';

    /**
     * @param {Function} [destroy]
     * @constructor
     */
    function PushStream(destroy) {
        var callbacks = [], self = this;

        Stream.call(this, function (sinkNext, sinkError, sinkComplete) {
            callbacks.push({
                value: sinkNext,
                error: sinkError,
                complete: sinkComplete
            });
        });

        function push(value, error) {
            if (isDefined(error)) {
                invoke(callbacks, 'error', error, self);
            } else if (isDefined(value)) {
                invoke(callbacks, 'value', value);
            } else {
                invoke(callbacks, 'complete');
                isDefined(destroy) && destroy();
            }
        }

        this.push = push;
    }

    PushStream.constructor = PushStream;
    PushStream.prototype = Object.create(Stream.prototype);

    return PushStream;
});
