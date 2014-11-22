if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function() {
    'use strict';

    /**
     * @constructor
     */
    function Events() {
        this.events = {};
        this.eventsCallbacks = 0;
    }

    Events.constructor = Events;
    Events.prototype.eachEvent = function(name, func) {
        name.split(/\s+/).forEach(function(name) {
            func(name, (this.events[name] = name in this.events ? this.events[name] : []));
        }.bind(this));
    };
    Events.prototype.on = function(name, func) {
        this.eachEvent(name, function(name, events) {
            events.push(func);
            ++this.eventsCallbacks;
        }.bind(this));

        return this;
    };
    Events.prototype.once = function(name, func) {
        func.once = true;
        return this.on(name, func);
    };
    Events.prototype.off = function(name, func) {
        var idx;
        this.eachEvent(name, function(name, events) {
            if (typeof func === 'function') {
                idx = events.indexOf(func);
                if (-1 !== idx) {
                    events.splice(idx, 1);
                    --this.eventsCallbacks;
                }
            } else {
                this.eventsCallbacks -= events.length;
                events.length = 0;
            }
        }.bind(this));

        return this;
    };
    Events.prototype.trigger = function(name, args, context) {
        var self = this;
        this.eachEvent(name, function(name, events) {
            events.forEach(function(func, idx) {
                // If once then remove after triggering
                if (func.once) {
                    events.splice(idx, 1);
                    --self.eventsCallbacks;
                }
                func.apply(context || func, args);
            });
        });

        return this;
    };

    return Events;
});
