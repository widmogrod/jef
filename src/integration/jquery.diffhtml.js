if (typeof define === "function" && define.amd && typeof window.jQuery === 'function')  {
    define("jquery", [], function() {
        return window.jQuery;
    });
}

define([
    '../domdiff/diff',
    '../domdiff/applyDiff',
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

