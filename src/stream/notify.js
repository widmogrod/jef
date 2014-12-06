define([
    '../functional/once',
    './continuable',
    './streamable',
    './callIfOrThrow',
    './callIfCallable'
], function(once, continuable, streamable, callIfOrThrow, callIfCallable) {
    'use strict';

    /**
     * @param {Function} onValue
     * @param {Function} onError
     * @param {Function} onComplete
     * @return {Function}
     */
    return function notify(onValue, onError, onComplete) {
        return once(function sink(value, next) {
            var result;

            try {
                result = onValue(value, next);
            } catch(e) {
                // Here you have possibility of intercept the error
                next = callIfOrThrow(onError, e, next);
            }

            if (continuable(result) && streamable(next)) {
                next.on(onValue, onError, onComplete)
            } else {
                callIfCallable(onComplete);
                // Clear callbacks, help garbage collector
                //onValue = onError = onComplete = null;
            }
        })
    }
});
