define([
    './updateIn',
    './copyArray'
], function(updateIn, copyArray) {
    'use strict';

    return function setIn(path, inTrie, key, value) {
        return updateIn(path, inTrie, function(node, options) {
            if (options.isLast) {
                node.v = value;
                node.k = key;
            }

            if (options.hasNode) {
                node.nodes = copyArray(options.original.nodes, node.nodes);
            }

            return node;
        });
    };
});
