if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './nodeLength'
], function(nodeLength) {
    'use strict';

    /**
     * Test if given nodes are leafs;
     * Don't have children
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Boolean}
     */
    return function nodeLeaf(a, b) {
        return nodeLength(a) === 0
        && nodeLength(b) === 0;
    }
});
