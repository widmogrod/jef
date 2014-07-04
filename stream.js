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

    stream.prototype.pipe = function(func, from, limit) {
        if (from < 0) {
            from += this.buffer.length;
        }
        this.buffer.forEach(function(value, index) {
            if (undefined !== from && from > index) {
                return;
            }
            if (undefined !== limit && --limit < 0) {
                return;
            }

            func.apply(func, value);
            // func.apply(func, this.options.apply ? value : [value]);
        }.bind(this));

        return this.on('data', func);
    };
    stream.prototype.last = function(func) {
        return this.pipe(func, -1, 1);
    };
    stream.prototype.first = function(func) {
        return this.pipe(func, 0, 1);
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
            filter: function() {
                return !func.apply(func, arguments);
            }
        }));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.reject = function(func) {
        // Create new stream that will reject values that don't filter test
        this.chain.push(new stream({
            apply: this.options.apply,
            filter: func
        }));
        return this.chain[this.chain.length - 1];
    };

    stream.prototype.push = function(data) {
        // Arguments to array
        data = slice(arguments);

        // On new data mark stream as not filtered
        this.filtered = false;

        // Test data if this part of the stream would like to accept it
        if (this.options.filter && this.options.filter.apply(this.options.filter, data)) {
            this.filtered = true;
            return this.trigger('out', data, this);
            // return this.trigger('out', this.options.apply ? data : [data], this);
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

        // Collect streamed data
        this.buffer.push(data);

        if (this.options.take) {
            var length = this.buffer.length;
            var end = length - this.options.take.skip;
            var start = end - this.options.take.limit;

            start = start < 0 ? 0 : start;

            // console.log('take', start, end, this.options.take);
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
        // this.trigger('data', this.options.apply ? data : [data], this);

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
            // apply: true,
            filter: function(streams) {
                return -1 !== streams.called.indexOf(false);
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
            item.last(refs[index]);
        });

        return result;
    };

    return stream;
});
