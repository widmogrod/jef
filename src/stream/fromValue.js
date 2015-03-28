define([
    './stream',
    './decorator/on-attach-decorator',
    '../functional/noop'
], function (Stream, StreamOnAttachDecorator, noop) {
    'use strict';

    /**
     * @param {*}
     * @return {Stream}
     */
    return function fromValue(value) {
        return new StreamOnAttachDecorator(noop, function(onValue, onError, onComplete) {
            onValue(value);
            onComplete();
            return Stream.stop;
        });
    };
});
