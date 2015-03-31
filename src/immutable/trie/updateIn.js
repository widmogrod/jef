define([
    '../trie/copyArray',
    './createTrieNodes',
    './createTrieNode'
], function(copyArray, createTrieNodes, createTrieNode) {
    'use strict';

    return function updateIn(path, inTrie, update) {
        var node,
            hasNode,
            level = 0,
            depth = path.length - 1,
            result = createTrieNodes(),
            original = inTrie,
            current = result;

        for (; level <= depth; level++) {
            node = path[level];
            hasNode = original && original[node];

            if (original !== false) {
                current = copyArray(original, current);
            }

            current[node] = update(createTrieNode(), {
                isLast: level === depth,
                hasNode: hasNode,
                original: original[node]
            });

            current = current[node].nodes;
            original = hasNode ? original[node].nodes : false;
        }

        return result;
    };
});
