define([
    './stream',
    '../functional/reduce',
    '../functional/isFunction',
    '../functional/isDefined',
    '../functional/invoke'
], function(Stream, reduce, isFunction, isDefined, invoke) {
    'use strict';

    /**
     * @param {Function} [destroy]
     * @constructor
     */
    function PushStream(destroy) {
        var callbacks = [],
            closed = false,
            self = this;

        Stream.call(this, function(sinkValue, sinkError, sinkComplete) {
            if (closed) {
                return;
            }

            callbacks.push({
                onValue: sinkValue,
                onError: sinkError,
                onComplete: sinkComplete
            });
        });

        function push(value, error) {
            if (closed) {
                return self;
            }

            if (isDefined(error)) {
                callbacks = reduce(callbacks, function(callback, base) {
                    if (Stream.streamable(callback.onError(error, self))) {
                        base.push(callback);
                    }

                    return base;
                }, []);

                // If there are callbacks then stream is not closed,
                // Error was handled, so we continue
                closed = !callbacks.length;
            } else if (isDefined(value)) {
                callbacks = reduce(callbacks, function(callback, base) {
                    if (Stream.continuable(callback.onValue(value))) {
                        base.push(callback);
                    }

                    return base;
                }, []);
            } else {
                closed = true;
                invoke(callbacks, 'onComplete');
            }

            if (closed) {
                callbacks = [];
                isFunction(destroy) && destroy();
            }

            return self;
        }

        this.push = push;
    }

    PushStream.constructor = PushStream;
    PushStream.prototype = Object.create(Stream.prototype);

    return PushStream;
});
