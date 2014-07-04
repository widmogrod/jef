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

    jQuery.fn.diffhtml = function(html) {
        var ref, diff, func;

        ref = document.createElement('div');

        return this.map(function() {
            // Create in memory DOM nodes
            ref.innerHTML = html;
            // Compare document state with memory state
            diff = domdiff.diff(this, ref);
            // Apply difference
            domdiff.applyDiff(this, ref, diff);

            return this;
        });
    }

    return jQuery;
});

