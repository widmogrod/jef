if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    '../src/domdiff/diff',
    '../src/domdiff/applyDiff',
    'jquery'
], function(diff, applyDiff, jQuery) {
    'use strict';

    jQuery.fn.diffhtml = function(html) {
        var ref, diffRef;

        return this.map(function() {
            // Create clone
            ref = this.cloneNode(false);
            // Create in memory DOM nodes
            ref.innerHTML = html;
            // Compare document state with memory state
            diffRef = diff(this, ref);
            // Apply difference
            applyDiff(this, ref, diffRef);

            return this;
        });
    };

    return jQuery;
});

