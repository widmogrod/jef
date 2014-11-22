if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    '../stream',
    'jquery'
], function(Stream, jQuery) {
    'use strict';

    jQuery.fn.streamOn = function(eventName, selector) {
        var result = new Stream();
        this.on(eventName, selector, function (e) {
            result.push(e);
        });
        return result;
    };

    return jQuery;
});

