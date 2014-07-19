(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('./events.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/events'], factory);
    } else { // Browser globals
        root.jef = root.jef || {};
        root.jef.Stream = factory(
            root.jef.events
        );
    }
})(this, function(events, undefined) {
    'use strict';

    // Helper functions
    var slice =  Function.prototype.call.bind(Array.prototype.slice);

    // Private functions
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
     */
    function Stream(options) {
        events.call(this);

        this.options = options || {};
        this.chain = [];
        this.buffer = [];
        this.filtered = false;
    }
    Stream.constructor = Stream;
    Stream.prototype = new events();

    Stream.prototype.hasReaders = function() {
        return this.eventsCallbacks > 0;
    };
    Stream.prototype.hasDrain = function() {
        return typeof this.options.drain === 'function';
    };
    Stream.prototype.on = function(name, func) {
        var result = events.prototype.on.call(this, name, func);
        this.trigger('drain');
        return result;
    };
    Stream.prototype.pipe = function(toStream) {
        // Accept only streams
        if (!toStream instanceof Stream) {
            throw new Error('You can pipe to another stream, but given ' + toStream);
        }

        // Connect two streams
        this.on('data', toStream.push.bind(toStream));

        // If we can drain this stream then do it
        if (!this.hasDrain()) {
            return toStream;
        }

        // If next stream dont have readers,
        // and we have drain function postpone drain
        // until this stream or next will have stream readers
        if (!toStream.hasReaders()) {
            toStream.on('drain', drain.bind(this));
            return toStream;
        }

        // Drain data from stream
        drain.call(this);

        return toStream;
    };
    Stream.prototype.take = function (limit, skip, allowEmpty) {
        // Create new stream that will reject values that don't filter test
        this.chain.push(new Stream({
            // apply: true,
            take: {
                limit: limit,
                skip: skip || 0,
                allowEmpty: !! allowEmpty
            }
        }));
        return this.chain[this.chain.length - 1];
    }
    Stream.prototype.map = function(func) {
        // Create new stream with that maps values to new form
        this.chain.push(new Stream({
            apply: this.options.apply,
            map: func
        }));
        return this.chain[this.chain.length - 1];
    };
    Stream.prototype.accept = function(func) {
        // Create new stream that will accept values that pass filter test
        this.chain.push(new Stream({
            apply: this.options.apply,
            filter: func
        }));
        return this.chain[this.chain.length - 1];
    };
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
    Stream.prototype.reduce = function(func, base) {
        this.chain.push(new Stream({
            reduce: {
                func: func,
                base: base
            }
        }));
        return this.chain[this.chain.length - 1];
    };
    Stream.prototype.push = function(data) {
        if (this.hasDrain()) {
            throw new Error('Stream cant push data because it has drain function');
        }

        // Arguments to array
        data = slice(arguments);

        // On new data mark stream as not filtered
        this.filtered = false;

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

        // Notify that data was set
        this.trigger('data', data, this);

        // Notify children nodes
        this.chain.forEach(function(stream) {
            stream.push.apply(stream, data);
        });

        return this;
    };
    Stream.prototype.merge = function(next) {
        return Stream.merge(this, next);
    };
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
    }

    return Stream;
});
