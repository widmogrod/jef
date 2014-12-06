define([
    '../functional/once',
    './callIfOrThrow',
    './callIfCallable'
], function(once, callIfOrThrow, callIfCallable) {
    'use strict';

    /**
     * @param {Function} onValue
     * @param {Function} onError
     * @param {Function} onComplete
     * @return {Function}
     */
    function notify(onValue, onError, onComplete) {
        return once(function sink(value, next) {
            var result;

            try {
                result = onValue(value, next);
            } catch(e) {
                // Here you have possibility of intercept the error
                next = callIfOrThrow(onError, e, next);
            }

            if (Stream.continuable(result) && Stream.streamable(next)) {
                next.on(onValue, onError, onComplete)
            } else {
                callIfCallable(onComplete);
                // Clear callbacks, help garbage collector
                //onValue = onError = onComplete = null;
            }
        })
    }

    /**
     * @param {Function} implementation
     * @constructor
     */
    function Stream(implementation) {
        /**
         * @param {Function} onValue
         * @param {Function} onError
         * @param {Function} onComplete
         * @returns {Stream}
         */
        this.on = function(onValue, onError, onComplete) {
            implementation.call(this, notify(onValue, onError, onComplete));
            return this;
        }
    }

    Stream.constructor = Stream;

    /**
     * @constant
     * @return {Number}
     */
    Stream.stop = -1;

    /**
     * @param {*} value
     * @return {Boolean}
     */
    Stream.streamable = function(value) {
        return value instanceof Stream;
    };

    /**
     * @param {*} value
     * @return {Boolean}
     */
    Stream.continuable = function(value) {
        return value !== Stream.stop;
    };

    return Stream;
});
