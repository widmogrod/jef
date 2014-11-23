define(function() {
    'use strict';

    /**
     * Retrieve child node at {index} for given element;
     *
     * @param {Element} node
     * @param {Integer} index
     * @return {Element}
     */
    return function nodeRetrieve(node, index) {
        return node.childNodes[index];
    }
});
