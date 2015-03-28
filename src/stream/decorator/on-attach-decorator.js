define(['../stream'], function(Stream) {
    'use strict';

    function StreamOnAttachDecorator(implementation, onAttacheOnValue) {
        Stream.call(this, implementation);

        var on = this.on;

        this.on = function onLast(onValue, onError, onComplete) {
            if (Stream.continuable(onAttacheOnValue(onValue, onError, onComplete))) {
                on(onValue, onError, onComplete);
            }
            return this;
        };
    }

    StreamOnAttachDecorator.constructor = StreamOnAttachDecorator;
    StreamOnAttachDecorator.prototype = Object.create(Stream.prototype);

    return StreamOnAttachDecorator;
});