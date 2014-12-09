define([
    '../functional/until',
    '../functional/isFunction',
    '../functional/noop',
    '../functional/apply'
], function(until, isFunction, noop, apply) {
    'use strict';

    /**
     * @param {Function} onValue
     * @param {Function} onError
     * @param {Function} onComplete
     * @return {Function}
     */
    function notifyValue(onValue, onError, onComplete) {
        return function sinkValue(value, next) {
            try {
                var result = onValue(value, next);
            } catch (e) {
                // Here you have possibility of intercept the error
                next = onError(e, next);
            }

            if (Stream.continuable(result) && Stream.streamable(next)) {
                next.on(onValue, onError, onComplete)
            } else if (!Stream.continuable(next)) {
                onComplete();
            }
        }
    }

    /**
     * @param {Function} onValue
     * @param {Function} onError
     * @param {Function} onComplete
     * @return {Function}
     */
    function notifyError(onValue, onError, onComplete) {
        return function sinkError(e, next) {
            // Here you have possibility of intercept the error
            next = onError(e, next);

            if (Stream.streamable(next)) {
                next.on(onValue, onError, onComplete)
            } else {
                onComplete();
            }
        }
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
            var stopped = false,
                isNotStopped = function() {
                    return false === stopped
                },
                stopIfNotContinuable = function(fn) {
                    return function(value, next) {
                        var result = fn(value, next);

                        if (!Stream.continuable(result)) {
                            stopped = null;
                        }

                        return result;
                    }
                },
                completeCall = function(fn) {
                    return function() {
                        if (!stopped) {
                            stopped = null;
                            apply(fn, arguments);
                        }
                    }
                };

            onValue = until.is(onValue) ? onValue : until(isNotStopped, stopIfNotContinuable(isFunction(onValue) ? onValue : noop));
            onError = until.is(onError) ? onError : until(isNotStopped, isFunction(onError) ? onError : noop);
            onComplete = until.is(onComplete) ? onComplete : until(isNotStopped, completeCall(isFunction(onComplete) ? onComplete : noop));

            implementation.call(this,
                notifyValue(onValue, onError, onComplete),
                notifyError(onValue, onError, onComplete),
                onComplete
            );
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
