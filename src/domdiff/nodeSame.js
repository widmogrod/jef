define(function() {
    'use strict';

    /**
     * Test if given nodes are the same.
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Boolean}
     */
    return function nodeSame(a, b) {
        if (a.nodeType !== b.nodeType) {
            return false;
        }
        if (a.nodeName !== b.nodeName) {
            return false;
        }
        return true;
    }
});
