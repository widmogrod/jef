define(function () {
    'use strict';

    /**
     * @param {Stream} streamA
     * @param {Stream} streamB
     * @return {Stream}
     */
    return function merge(streamA, streamB) {
        var completed = 0;
        return new streamA.constructor(function (sinkValue, sinkError, sinkComplete) {
            function onComplete() {
                if (++completed > 1) {
                    sinkComplete();
                }
            }

            streamA.on(function (value) {
                sinkValue(value);
            }, sinkError, onComplete);

            streamB.on(function (value) {
                sinkValue(value);
            }, sinkError, onComplete);
        });
    };
});
