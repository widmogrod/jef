define(function() {
    'use strict';

    /**
     * Stream interface
     *
     * @constructor
     */
    function StreamInterface() {}

    StreamInterface.constructor = StreamInterface;
    StreamInterface.prototype = {
        /**
         * React on value in stream.
         *
         * @param {Function} value
         * @param {Function} error
         * @param {Function} complete
         */
        on: function(value, error, complete) {},
        /**
         * Stop listening on stream
         *
         * @param {Function} value
         * @param {Function} error
         * @param {Function} complete
         */
        off: function(value, error, complete) {},
        /**
         * Push value to the stream.
         * @param {*} value
         *
         * @param {*} error
         * @param {*} complete
         */
        push: function(value, error, complete) {},
        /**
         * Pipe stream to another
         *
         * @param {StreamInterface} stream
         */
        pipe: function(stream) {}
    };

    return StreamInterface;
});
