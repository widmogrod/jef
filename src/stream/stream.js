define([
    '../functional/invoke',
    '../functional/reduce',
    '../functional/isFunction',
    '../functional/noop'
], function(invoke, reduce, isFunction, noop) {
    'use strict';

    /**
     * @param callback
     * @param error
     * @param next
     * @returns {boolean}
     * @private
     */
    function continueError(callback, error, next) {
        var result = callback.onError(error, next);


        if (Stream.streamable(result)) {
            return true;
        } else {
            callback.onComplete();
        }
    }

    /**
     * @param callback
     * @param value
     * @param next
     * @returns {boolean}
     * @private
     */
    function continueValue(callback, value, next) {
        var result = callback.onValue(value);

        if (!Stream.continuable(result)) {
            return false;
        }

        if (!Stream.continuable(next)) {
            callback.onComplete();
            return false;
        }

        if (Stream.streamable(next)) {
            // Pass control to next stream
            next.on(callback.onValue, callback.onError, callback.onComplete);
            return false;
        }

        return true;
    }

    /**
     * @param {Function} implementation
     * @constructor
     */
    function Stream(implementation) {
        var callbacks = []
          , init = false
          , closed = false;

        /**
         * @param {Function} onValue
         * @param {Function} onError
         * @param {Function} onComplete
         * @returns {Stream}
         */
        this.on = function on(onValue, onError, onComplete) {
            var callback = {
                onValue: isFunction(onValue) ? onValue : noop,
                onError: isFunction(onError) ? onError : noop,
                onComplete: isFunction(onComplete) ? onComplete : noop
            };

            if (closed) {
                callback.onComplete();
                return this;
            }

            callbacks.push(callback);

            // Lazy initialization
            if (!init) {
                init = true;
                implementation(sinkValue, sinkError, sinkComplete);
            }

            return this;
        };

        function sinkValue(value, next) {
            if (closed) {
                return;
            }

            callbacks = reduce(callbacks, function(base, callback) {
                if (continueValue(callback, value, next)) {
                    base.push(callback);
                }

                return base;
            }, []);
        }

        function sinkError(error, next) {
            if (closed) {
                return;
            }

            callbacks = reduce(callbacks, function(base, callback) {
                if (continueError(callback, error, next)) {
                    base.push(callback);
                }

                return base;
            }, []);

            // If any callback exists then stream is not closed.
            // An error was handled, so we continue
            closed = !callbacks.length;
        }

        function sinkComplete() {
            closed = true;
            invoke(callbacks, 'onComplete');
            callbacks = [];
        }
    }

    Stream.constructor = Stream;
    Stream.prototype.constructor = Stream;

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
