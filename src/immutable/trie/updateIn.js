define([
    '../../functional/reduce',
    '../../functional/isDefined',
    './createTrieNodes',
    './createTrieNode'
], function(reduce, isDefined, createTrieNodes, createTrieNode) {
    'use strict';

    return function updateIn(path, inTrie, update) {
        return reduce(path, function(base, node, level) {
            var i,
                nodes = base.nodes,
                isLast = level === base.depth,
                hasNode = nodes && nodes[node],
                hasNodes = nodes !== false;

            // Create new trie level
            var g = createTrieNodes();

            if (null === base.next) {
                // Create new trie, first group is starting first level.
                // Do it only once, to keep reference to root level of the trie
                base.result = g;
            } else {
                // Create new level of nodes to previous level of the new trie structure
                base.next.nodes = g;
            }

            // Copy by reference values from original trie level to new one,
            // except node that is updated/created right now
            if (hasNodes) {
                for (i = 0; i < 4; i++) {
                    if ((!isLast || i !== node)
                        && isDefined(nodes[i]) // isDefines allows to keep sparse arrays sparse
                    ) {
                        g[i] = nodes[i];
                    }
                }
            }

            g[node] = createTrieNode();
            g[node] = update(g[node], {
                isLast: isLast,
                hasNode: hasNode,
                original: nodes[node]
            });

            base.next = g[node];
            base.nodes = hasNode ? nodes[node].nodes : false;

            return base;
        }, {
            nodes: inTrie,
            result: [],
            next: null,
            depth: path.length - 1
        }).result;
    };
});
