define([
    './stream',
    '../functional/isFunction',
    '../functional/isDefined',
    '../functional/invoke'
], function (Stream, isFunction, isDefined, invoke) {
    'use strict';

    /**
     * @param {Function} [implementation]
     * @param {Function} [destroy]
     * @constructor
     */
    function PushStream(implementation, destroy) {
        var callbacks = [], self = this;

        Stream.call(this, function (sinkNext, sinkError, sinkComplete) {
            isFunction(implementation) && implementation(sinkNext, sinkError, sinkComplete);

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
                isFunction(destroy) && destroy();
            }
        }

        this.push = push;
    }

    PushStream.constructor = PushStream;
    PushStream.prototype = Object.create(Stream.prototype);

    return PushStream;
});
