define([
    './updateIn',
    './copyNodes'
], function(updateIn, copyNodes, undefined) {
    'use strict';

    return function deleteIn(path, inTrie) {
        return updateIn(path, inTrie, function(node, options) {
            if (options.isLast) {
                node.v = undefined;
            } else if (options.hasNode) {
                node = copyNodes(options.original, node);
            }

            return node;
        });
    };
});
