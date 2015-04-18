define([
    './stream',
    '../functional/isDefined'
], function(Stream, isDefined) {
    'use strict';

    /**
     * @constructor
     */
    function PushStream() {
        var callback;

        Stream.call(this, function(sinkValue, sinkError, sinkComplete) {
            callback = {
                sinkValue: sinkValue,
                sinkError: sinkError,
                sinkComplete: sinkComplete
            };
        });

        this.push = function push(value, error) {
            if (!callback) {
                return this;
            }

            if (isDefined(error)) {
                callback.sinkError(error, this);
            } else if (isDefined(value)) {
                callback.sinkValue(value);
            } else {
                callback.sinkComplete();
            }

            return this;
        };
    }

    PushStream.prototype = Object.create(Stream.prototype);
    PushStream.prototype.constructor = PushStream;

    return PushStream;
});
