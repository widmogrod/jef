if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function() {
    'use strict';

    /**
     * Retrive number of children for given node
     *
     * @param {Element} node
     * @return {Integer}
     */
    return function nodeLength(node) {
        return node.childNodes.length;
    }
});
