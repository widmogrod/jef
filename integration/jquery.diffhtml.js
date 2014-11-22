if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    '../domdiff',
    'jquery'
], function(domdiff, jQuery) {
    'use strict';

    jQuery.fn.diffhtml = function(html) {
        var ref, diff;

        return this.map(function() {
            // Create clone
            ref = this.cloneNode(false);
            // Create in memory DOM nodes
            ref.innerHTML = html;
            // Compare document state with memory state
            diff = domdiff.diff(this, ref);
            // Apply difference
            domdiff.applyDiff(this, ref, diff);

            return this;
        });
    };

    return jQuery;
});

