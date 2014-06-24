(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../domdiff.js'),
            require('jquery')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/domdiff','jquery'], factory);
    } else { // Browser globals
        factory(
            root.jef.domdiff,
            jQuery
        );
    }
})(this, function(domdiff, jQuery) {
    'use strict';

    var DEFAULT_OPTIONS = {
        debug: false,
        returnDiff: false
    };

    jQuery.fn.diffhtml = function(html, options) {
        var ref, diff, func;

        options = jQuery.extend(true, {}, DEFAULT_OPTIONS, options)

        ref = document.createElement('div');
        return this.map(function() {
            // Create in memory DOM nodes
            ref.innerHTML = html;
            // Compare document state with memory state
            diff = domdiff.diff(this, ref);
            // For debug purposes
            if (options.debug) {
                console.debug('from', this.innerHTML);
                console.debug('to', ref.innerHTML);
                console.debug('diff', diff);
            }
            if (options.returnDiff) {
                return diff;
            }
            // Apply difference
            domdiff.applyDiff(this, ref, diff);

            return this;
        });
    }

    return jQuery;
});
