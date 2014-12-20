define(['./stream', '../functional/isDefined', '../functional/invoke'], function (Stream, isDefined, invoke) {
    'use strict';

    /**
     * @param {Function} destroy
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

        this.push = function push(value, error) {
            if (isDefined(error)) {
                invoke(callbacks, 'error', error, self);
            } else if (isDefined(value)) {
                invoke(callbacks, 'value', value);
            } else {
                invoke(callbacks, 'complete');
                destroy();
            }
        };
    }

    PushStream.constructor = PushStream;
    PushStream.prototype = Object.create(Stream.prototype);

    return PushStream;
});
