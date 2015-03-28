if (typeof define === "function" && define.amd && typeof window.jQuery === 'function')  {
    define("jquery", [], function() {
        return window.jQuery;
    });
}

define([
    '../stream',
    'jquery'
], function(Stream, jQuery) {
    'use strict';

    jQuery.fn.streamOn = function(eventName, selector) {
        return Stream.fromEmitter($(this), selector, eventName);
    };

    return jQuery;
});
