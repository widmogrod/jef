define([
    './updateIn',
    './copyArray'
], function(updateIn, copyArray, undefined) {
    'use strict';

    return function deleteIn(path, inTrie) {
        return updateIn(path, inTrie, function(node, options) {
            if (options.isLast) {
                node.v = undefined;
                node.k = undefined;
            } else if (options.hasNode) {
                node.nodes = copyArray(options.original.nodes, node.nodes);
            }

            return node;
        });
    };
});
