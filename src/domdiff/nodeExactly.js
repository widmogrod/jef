
define([
    './nodeSame'
], function(nodeSame) {
    'use strict';

    /**
     * Check if given nodes are exacly the same
     * (textContent and nodeName are equal)
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Boolean}
     */
    return function nodeExactly(a, b) {
        return a.textContent === b.textContent
        && nodeSame(a, b);
    }
});
