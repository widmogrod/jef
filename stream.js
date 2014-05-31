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

    function stream(options) {
        events.call(this);
        this.options = options || {};
        this.chain = [];
        this.values = [];
        this.filtered = false;
    }
    stream.constructor = stream;
    stream.prototype = new events();

    stream.prototype.pipe = function(func, from, limit) {
        if (from < 0) {
            from += this.values.length;
        }
        this.values.forEach(function(value, index) {
            if (undefined !== from && from > index) {
                return;
            }
            if (undefined !== limit && --limit < 0) {
                return;
            }

            func.apply(func, this.options.apply ? value : [value]);
        }.bind(this));

        return this.on('value', func);
    };
    stream.prototype.last = function(func) {
        return this.pipe(func, -1, 1);
    };
    stream.prototype.first = function(func) {
        return this.pipe(func, 0, 1);
    };
    stream.prototype.map = function(func) {
        // Create new stream
        this.chain.push(new stream({map: func}));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.filter = function(func) {
        // Create new stream
        this.chain.push(new stream({filter: func}));
        return this.chain[this.chain.length - 1];
    };
    stream.prototype.value = function(value) {
        // On new value mark stream as not filtered
        this.filtered = false;

        // Test value if this part of the stream would like to accept it
        if (this.options.filter && !this.options.filter(value)) {
            this.filtered = true;
            return this.trigger('out', this.options.apply ? value : [value], this);
        }

        // Lets map our result
        if (this.options.map) {
            if (typeof this.options.map === 'function')  {
                value = this.options.map(value);
            } else {
                value = this.options.map;
            }
        }

        // Collect streamed value
        this.values.push(value);

        // Notify that value was set
        this.trigger('value', this.options.apply ? value : [value], this);

        // Notify children nodes
        this.chain.forEach(function(stream) {
            stream.value(value);
        });

        return this;
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

    stream.when = function() {
        var data = Array.prototype.slice.call(arguments);
        var refs = [];
        var buffer = new Array(data.length);
        var called = new Array(data.length);
        var result = new stream({
            apply: true,
            filter: function(value) {
                return -1 === value.called.indexOf(false);
            },
            map: function(value) {
                return value.arguments;
            },
            destroy: function() {
                data.forEach(function(item, index) {
                    item.off('out', refs[index]);
                    item.off('value', refs[index]);
                });
            }
        });

        data.forEach(function(item, index) {
            called[index] = false;
            refs[index] = function(value) {
                called[index] = !this.filtered;
                buffer[index] = value;
                result.value({arguments: buffer, called: called });
            }
            item.on('out', refs[index]);
            item.last(refs[index]);
        });

        return result;
    };

    return stream;
});
