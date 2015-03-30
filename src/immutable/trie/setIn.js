define([
    './updateIn',
    './copyNodes'
], function(updateIn, copyNodes) {
    'use strict';

    return function setIn(path, inTrie, value) {
        return updateIn(path, inTrie, function(node, options) {
            if (options.isLast) {
                node.v = value;
            }

            if (options.hasNode) {
                node = copyNodes(options.original, node);
            }

            return node;
        });
    };
});
