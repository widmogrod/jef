(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../domdiff.js'),
            require('jquery')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/domdiff','jQuery'], factory);
    } else { // Browser globals
        factory(
            root.jef.domdiff,
            jQuery
        );
    }
})(this, function(domdiff, jQuery) {
    'use strict';

    jQuery.fn.diffhtml = function(html) {
        var ref, diff, func;

        ref = document.createElement('div');
        return this.each(function() {
            // Create in memory DOM nodes
            ref.innerHTML = html;
            // Compare document state with memory state
            diff = domdiff.diff(this, ref);
            // Create function to apply difference
            func = new Function('aElement', 'bElement', diff)
            // Apply difference
            func(this, ref);
        });
    }

    return jQuery;
});

