(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(factory);
    } else { // Browser globals
        root.jef = root.jef || {};
        root.jef.events = factory();
    }
})(this, function() {
    'use strict';

    function events() {
        this.events = {};
    }

    events.constructor = events;
    events.prototype.eachEvent = function(name, func) {
        name.split(/\s+/).forEach(function(name) {
            this.events[name] = name in this.events ? this.events[name] : [];
            func(name, this.events[name]);
        }.bind(this));
    };
    events.prototype.on = function(name, func) {
        this.eachEvent(name, function(name, events) {
            events.push(func);
        }.bind(this));

        return this;
    };
    events.prototype.off = function(name, func) {
        var idx;
        this.eachEvent(name, function(name, events) {
            if (typeof func === 'function') {
                idx = events.indexOf(func);
                if (-1 !== idx) {
                    events.splice(idx, 1);
                }
            } else {
                events.length = 0;
            }
        }.bind(this));

        return this;
    };
    events.prototype.trigger = function(name, args, context) {
        this.eachEvent(name, function(name, events) {
            events.forEach(function(func) {
                func.apply(context || func, args);
            });
        }.bind(this));

        return this;
    };

    return events;
});
