(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../stream.js'),
            require('jquery')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/stream','jquery'], factory);
    } else { // Browser globals
        factory(
            root.jef.stream,
            jQuery
        );
    }
})(this, function(stream, jQuery) {
    'use strict';

    jQuery.fn.streamOn = function(eventName, selector) {
        var result = new stream();
        this.on(eventName, selector, function (e) {
            result.push(e);
        });
        return result;
    }

    return jQuery;
});

