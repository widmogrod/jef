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

    var slice =  Function.prototype.call.bind(Array.prototype.slice);

    function stream(options) {
        events.call(this);
        this.options = options || {};
        this.chain = [];
        this.buffer = [];
        this.filtered = false;
    }
    stream.constructor = stream;
    stream.prototype = new events();

    stream.prototype.hasReaders = function() {
        return this.chain.length || this.eventsCallbacks;
    };
    stream.prototype.pipe = function(toStream) {
        // Accept only streams
        if (!toStream instanceof stream) {
            throw new Error('You can pipe to another stream, but given ' + toStream);
        }

        // If stream dont have readers then pipe all buffered values to this stream
        if (!this.hasReaders()) {
            // Assign bufer to temporary variable
            var buffer = this.buffer;
            // And clean current buffer
            this.buffer = [];
            // Then push everyting to next stream
            buffer.forEach(function(value) {
                toStream.push.apply(toStream, value)
            });
        }

        this.on('data', toStream.push.bind(toStream));
        return toStream;
    };
    stream.prototype.take = function (limit, skip, allowEmpty) {
        // Create new stream that will reject values that don't filter test
        this.chain.push(new stream({
            // apply: true,
            take: {
                limit: limit,
                skip: skip || 0,
                allowEmpty: !! allowEmpty
            }
        }));
        return this.chain[this.chain.length - 1];
    }
    stream.prototype.map = function(func) {
        // Create new stream with that maps values to new form
        this.chain.push(new stream({
            apply: this.options.apply,
            map: func
        }));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.accept = function(func) {
        // Create new stream that will accept values that pass filter test
        this.chain.push(new stream({
            apply: this.options.apply,
            filter: func
        }));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.reject = function(func) {
        // Create new stream that will reject values that don't filter test
        this.chain.push(new stream({
            apply: this.options.apply,
            filter: function() {
                return !func.apply(func, arguments);
            }
        }));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.reduce = function(func, base) {
        this.chain.push(new stream({
            reduce: {
                func: func,
                base: base
            }
        }));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.push = function(data) {
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

        // Collect streamed data
        this.buffer.push(data);

        // Dont have readers buffer everything
        if (!this.hasReaders()) {
            return this;
        }

        if (this.options.take) {
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
    stream.prototype.merge = function(next) {
        return stream.merge(this, next);
    };
    stream.prototype.destroy = function() {
        // Custom destroy function
        this.options.destroy && this.options.destroy();
        // Destroy childs
        this.chain.forEach(function(stream) {
            stream.destroy();
        });
        // Invoking constructor clean properties
        stream.call(this);
    };

    stream.merge = function () {
        var streams = slice(arguments);
        var refs = [];
        var merged = new stream({
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
    stream.when = function() {
        var streams = slice(arguments);
        var refs = [];
        var buffer = new Array(streams.length);
        var called = new Array(streams.length);
        var result = new stream({
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
    stream.fromArray = function(array) {
        var result = new stream();
        array.forEach(result.push.bind(result));
        return result;
    }

    return stream;
});
