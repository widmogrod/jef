define([
    './interface',
    '../functional/noop',
    '../functional/invoke',
    '../functional/apply',
    '../functional/slice',
    '../functional/immediate',
    '../functional/filter',
    '../functional/isDefined',
    '../functional/isFunction'
], function(
    StreamInterface,
    noop,
    invoke,
    apply,
    slice,
    immediate,
    filter,
    isDefined,
    isFunction,
    undefined
) {
    'use strict';

    /**
     * Generic stream
     *
     * @param {Function} implementation
     * @constructor
     */
    function Stream(implementation) {
        this._ons = [];
        this._closed = false;

        // Helper functions, simplifying usage of three methods on, off, push
        this.on.error = this.on.bind(this, undefined);
        this.on.complete = this.on.bind(this, undefined, undefined);
        this.off.error = this.off.bind(this, undefined);
        this.off.complete = this.off.bind(this, undefined, undefined);
        this.push.error = this.push.bind(this, undefined);
        this.push.complete = this.push.bind(this, undefined, undefined, true);

        if (isFunction(implementation)) {
            immediate(apply.bind(null, implementation.bind(this), slice(arguments, 1)));
        }
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

        // No observers, then there is no reason to exist
        if (!this._ons.length) {
            this.push.complete();
        }
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
