define([
    './interface',
    '../functional/invoke',
    '../functional/filter',
    '../functional/isDefined'
], function(
    StreamInterface,
    invoke,
    filter,
    isDefined,
    undefined
) {
    'use strict';

    function noop() {}

    /**
     * Generic stream
     *
     * @constructor
     */
    function Stream() {
        this._ons = [];
        this._closed = false;
        this.on.error = this.on.bind(this, undefined);
        this.on.complete = this.on.bind(this, undefined, undefined);
        this.off.error = this.off.bind(this, undefined);
        this.off.complete = this.off.bind(this, undefined, undefined);
        this.push.error = this.push.bind(this, undefined);
        this.push.complete = this.push.bind(this, undefined, undefined, true);
    }

    Stream.constructor = Stream;
    Stream.prototype = Object.create(StreamInterface.prototype);
    /**
     * React on value in stream.
     *
     * @param {Function} value
     * @param {Function} error
     * @param {Function} complete
     */
    Stream.prototype.on = function(value, error, complete) {
        // Allow to listen to the new values only when stream is open
        !this._closed && this._ons.push({
            value: value || noop,
            error: error || noop,
            complete: complete || noop
        });
    };
    /**
     * Stop listening on stream
     *
     * @param {Function} value
     * @param {Function} error
     * @param {Function} complete
     */
    Stream.prototype.off = function(value, error, complete) {
        this._ons = filter(this._ons, function(event) {
            return event.value !== value
                && event.error !== error
                && event.complete !== complete;
        });
    };
    /**
     * Push value to the stream.
     * @param {*} value
     * @param {*} error
     * @param {*} complete
     */
    Stream.prototype.push = function(value, error, complete) {
        if (this._closed) {
            return this;
        }

        if (isDefined(value)) {
            invoke(this._ons, 'value', value);
            return this;
        } else if (isDefined(error)) {
            invoke(this._ons, 'error', error);
        } else if (isDefined(complete)) {
            invoke(this._ons, 'complete');
        }

        this._closed = true;
        this._ons = [];

        return this;
    };
    /**
     * Pipe stream to another
     * @param {StreamInterface} stream
     */
    Stream.prototype.pipe = function(stream) {
        this.on(
            stream.push.bind(stream),
            stream.push.bind(stream, undefined),
            stream.push.bind(stream, undefined, undefined)
        );

        return stream;
    };

    return Stream;
});
