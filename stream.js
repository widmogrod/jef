(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('./events.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/events'], factory);
    } else { // Browser globals
        root.jef = root.jef || {};
        root.jef.stream = factory(
            root.jef.events
        );
    }
})(this, function(events, undefined) {
    'use strict';

    // Helper functions
    var slice =  Function.prototype.call.bind(Array.prototype.slice);

    /**
     * Drain the stream
     *
     * @this Stream
     */
    function drain() {
        var value,
        drain = this.options.drain;

        // You can drain once given stream
        this.options.drain = null;

        // Drain untill will be empty
        while (typeof (value = drain()) !== 'undefined') {
            this.push(value);
        }
    }

    /**
     * Represents a stream
     *
     * @constructor
     * @param {Object} options - Options object
     */
    function Stream(options) {
        events.call(this);

        this.options = options || {};
        this.chain = [];
        this.buffer = [];
        this.filtered = false;
        this.lastValue = [];
    }
    Stream.constructor = Stream;
    Stream.prototype = new events();

    /**
     * Check if stream has readers
     *
     * @return {Boolean}
     */
    Stream.prototype.hasReaders = function() {
        return this.eventsCallbacks > 0;
    };

    /**
     * Check wether we can drain data on not
     *
     * @return {Boolean}
     */
    Stream.prototype.canDrain = function() {
        return typeof this.options.drain === 'function';
    };

    /**
     * Register new event handler, and trigger the 'drain' event that stream is ready to datin.
     *
     * @param {String} name     An event to which attach listener
     * @param {Function} func   An listener to listne to the event
     * @return {Stream}
     */
    Stream.prototype.on = function(name, func) {
        var result = events.prototype.on.call(this, name, func);
        this.trigger('drain');
        return result;
    };

    /**
     * Pipe one stream to another
     *
     * @param {Stream} stream   An stream to pipe
     */
    Stream.prototype.pipe = function(stream) {
        // Accept only streams
        if (!stream instanceof Stream) {
            throw new Error('You can pipe to another stream, but given ' + stream);
        }

        // Connect two streams
        this.on('data', stream.push.bind(stream));

        // If we can drain this stream then do it,
        // Otherwise just connect streams
        if (!this.canDrain()) {
            return stream;
        }

        // If next stream dont have readers,
        // and we have drain function postpone drain
        // until this stream or next will have stream readers
        if (!stream.hasReaders()) {
            stream.on('drain', drain.bind(this));
            return stream;
        }

        // Drain data from stream
        drain.call(this);

        return stream;
    };

    /**
     * Create new stream based on current.
     *
     * Stream will buffer values and push them only when reach given {size}.
     * If flag {allowEmpty} is set this stream wont waint till
     * buffer size will be equal {size}, and will push data along the stream
     * even if doesn't have enough size.
     *
     * @param {Integer} size
     * @param {Integer} skip
     * @param {Boolean} allowEmpty
     * @return {Stream}
     */
    Stream.prototype.take = function (size, skip, allowEmpty) {
        // Create new stream that will reject values that don't filter test
        this.chain.push(new Stream({
            // apply: true,
            take: {
                limit: size,
                skip: skip || 0,
                allowEmpty: !! allowEmpty
            }
        }));
        return this.chain[this.chain.length - 1];
    }

    /**
     * Create new stream which will map values in to new representation.
     *
     * @param {Function} func
     * @return {Stream}
     */
    Stream.prototype.map = function(func) {
        // Create new stream with that maps values to new form
        this.chain.push(new Stream({
            apply: this.options.apply,
            map: func
        }));
        return this.chain[this.chain.length - 1];
    };

    /**
     * Create new stream which will accept only values
     * that test by given function {func}
     *
     * @param {Function} func
     * @return {Stream}
     */
    Stream.prototype.accept = function(func) {
        // Create new stream that will accept values that pass filter test
        this.chain.push(new Stream({
            apply: this.options.apply,
            filter: func
        }));
        return this.chain[this.chain.length - 1];
    };

    /**
     * Create new stream which wont accept values
     * when given text function {func} wont accept them.
     *
     * @param {Function} func
     * @return {Stream}
     */
    Stream.prototype.reject = function(func) {
        // Create new stream that will reject values that don't filter test
        this.chain.push(new Stream({
            apply: this.options.apply,
            filter: function() {
                return !func.apply(func, arguments);
            }
        }));
        return this.chain[this.chain.length - 1];
    };

    /**
     * Create new stream that will take all incomming values
     * And reduce them to the {base} by applying given function {func}
     *
     * @param {Function} func
     * @param {Function} base
     * @return {Stream}
     */
    Stream.prototype.reduce = function(func, base) {
        this.chain.push(new Stream({
            reduce: {
                func: func,
                base: base
            }
        }));
        return this.chain[this.chain.length - 1];
    };

    /**
     * Push data along the stream
     *
     * @param {Object} data
     * @return {Stream}
     */
    Stream.prototype.push = function(data) {
        if (this.canDrain()) {
            throw new Error('Stream cant push data because it has drain function');
        }

        // Arguments to array
        data = slice(arguments);

        // On new data mark stream as not filtered
        this.filtered = false;

        // Clear last value in case filter function wont accept this input
        // Experimental.
        this.lastValue = [];

        // Test data if this part of the stream would like to accept it
        if (this.options.filter && !this.options.filter.apply(this.options.filter, data)) {
            this.filtered = true;
            return this.trigger('out', data, this);
        }

        // Lets map our result
        if (this.options.map) {
            if (typeof this.options.map === 'function')  {
                data = this.options.map.apply(this, data);
            } else {
                data = this.options.map;
            }
            data = Array.isArray(data) ? data : [data];
        }

        // Lets reduce our stream
        if (this.options.reduce) {
            data = this.options.reduce.func.apply(
                this,
                data.concat(
                    this.options.reduce.base
                )
            );
            this.options.reduce.base = data;
            data = Array.isArray(data) ? data : [data];
        }

        // Lets buffer some values in stream
        if (this.options.take) {
            // Collect streamed data
            this.buffer.push(data);

            var length = this.buffer.length;
            var end = length - this.options.take.skip;
            var start = end - this.options.take.limit;

            start = start < 0 ? 0 : start;

            data = this.buffer.slice(start, end);

            // Will take only when will have given limit in buffer
            if (!this.options.allowEmpty
                && data.length !== this.options.take.limit
            ) {
                return this;
            }
        }

        this.lastValue = data;

        // Notify that data was set
        this.trigger('data', data, this);

        // Notify children nodes
        this.chain.forEach(function(stream) {
            stream.push.apply(stream, data);
        });

        return this;
    };

    /**
     * Function to be called on recent value from stream and on future values
     *
     * @param {Function} func
     * @return this
     */
    Stream.prototype.last = function(func) {
        // Call function with last value in stream
        func.apply(func, this.lastValue);
        // Subscribe function to new data
        this.on('data', func);

        return this;
    };

    /**
     * Crate new stream that merge two stream into one
     *
     * @param {Stream} next
     * @return {Stream}
     */
    Stream.prototype.merge = function(next) {
        return Stream.merge(this, next);
    };

    /**
     * Destroy stream
     */
    Stream.prototype.destroy = function() {
        // Custom destroy function
        this.options.destroy && this.options.destroy();
        // Destroy childs
        this.chain.forEach(function(stream) {
            stream.destroy();
        });
        // Invoking constructor clean properties
        Stream.call(this);
    };

    Stream.merge = function () {
        var streams = slice(arguments);
        var refs = [];
        var merged = new Stream({
            destroy: function() {
                streams.forEach(function(item, index) {
                    item.off('data', refs[index]);
                });
            }
        });
        streams.forEach(function (stream, index) {
            stream.on('data', refs[index] = function () {
                merged.push.apply(merged, arguments)
            });
        });

        return merged;
    }

    Stream.when = function() {
        var streams = slice(arguments);
        var refs = [];
        var buffer = new Array(streams.length);
        var called = new Array(streams.length);
        var result = new Stream({
            filter: function(streams) {
                // if true then is valid
                return -1 === streams.called.indexOf(false);
            },
            map: function(streams) {
                return streams.arguments;
            },
            destroy: function() {
                streams.forEach(function(item, index) {
                    item.off('out', refs[index]);
                    item.off('data', refs[index]);
                });
            }
        });

        streams.forEach(function(item, index) {
            called[index] = false;
            refs[index] = function(value) {
                called[index] = !this.filtered;
                buffer[index] = value;
                result.push({arguments: buffer, called: called });
            }
            item.on('out', refs[index]);
            item.on('data', refs[index]);

            // If stream have last value then set it
            result.lastValue.push(item.lastValue);
        });

        return result;
    };

    Stream.fromArray = function(array) {
        var index = -1, length = array.length;
        var result = new Stream({
            drain: function() {
                return ++index < length ? array[index] : undefined;
            }
        });
        return result;
    };

    Stream.fromPromise = function(promise, stream) {
        var result = stream instanceof Stream ? stream : new Stream();

        promise.then(function(value) {
            result.push(value);
        }, function(error) {
            result.trigger('error', arguments);
        });

        return result;
    };

    return Stream;
});
