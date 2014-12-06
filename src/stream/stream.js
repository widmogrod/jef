define(['./notify'], function(notify) {
    'use strict';

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

    /**
     * @constant
     * @return {Number}
     */
    Stream.stop = -1;
    Stream.constructor = Stream;

    return Stream;
});
