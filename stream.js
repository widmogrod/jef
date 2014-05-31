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
})(this, function(events) {
    'use strict';

    function stream(options) {
        events.call(this);
        this.options = options || {};
        this.chain = [];
    }
    stream.constructor = stream;
    stream.prototype = new events();

    stream.prototype.map = function(func) {
        // Create new stream
        this.chain.push(new stream({map: func}));
        return this.chain[this.chain.length - 1];
    }
    stream.prototype.filter = function(func) {
        // Create new stream
        this.chain.push(new stream({filter: func}));
        return this.chain[this.chain.length - 1];
    }
    stream.prototype.value = function(value) {
        // Test value if this part of the stream would like to accept it
        if (this.options.filter && !this.options.filter(value)) {
            return this.trigger('out', this.options.apply ? value : [value]);
        }

        // Lets map our result
        if (this.options.map) {
            if (typeof this.options.map === 'function')  {
                value = this.options.map(value);
            } else {
                value = this.options.map;
            }
        }

        // Notify that value was set
        this.trigger('value', this.options.apply ? value : [value]);

        // Notify children nodes
        this.chain.forEach(function(stream) {
            stream.value(value);
        });

        return this;
    }
    stream.prototype.destroy = function() {
        // Custom destroy function
        this.options.destroy && this.options.destroy();
        // Destroy childs
        this.chain.forEach(function(stream) {
            stream.destroy();
        });
        // Invoking constructor clean properties
        stream.call(this);
    }

    stream.when = function() {
        var data = [].prototype.slice.call(arguments);
        var refs = [];
        var buffer = new Array(data.length);
        var result = new stream({
            apply: true,
            filter: function(value) {
                return -1 === value.indexOf(undefined);
            },
            destroy: function() {
                data.forEach(function(item, index) {
                    item.off(refs[index][0]);
                    item.off(refs[index][1]);
                });
            }
        });

        data.forEach(function(item, index) {
            buffer[index] = undefined;
            refs[index] = [
                function() {
                    buffer[index] = undefined;
                    result.value(buffer);
                },
                function(value) {
                    buffer[index] = value;
                    result.value(buffer);
                }
            ];
            item.on('out',   refs[index][0]);
            item.on('value', refs[index][1]);
        });

        return result;
    };

    return stream;
});
