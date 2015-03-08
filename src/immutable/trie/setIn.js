define(['../../functional/reduce'], function(reduce) {
    'use strict';

    var GROUP_LENGTH = 4;

    return function setIn(path, inTrie, value) {
        return reduce(path, function(base, node, level) {
            var nodes = base.nodes,
                isLast = level === base.depth,
                hasNodes = nodes && nodes[node];

            // create new group
            var g = new Array(GROUP_LENGTH);

            if (null === base.next) {
                // create new trie, first group is starting one
                // to keep reference
                base.result = g;
            } else {
                base.next.nodes = g;
            }

            // set rest set as ref
            if (nodes) {
                for (var i = 0; i < GROUP_LENGTH; i++) {
                    if (!isLast || i !== node) {
                        g[i] = nodes[i];
                    }
                }
            }

            // If in path are no nodes then create them
            if (!hasNodes) {
                g[node] = {v: undefined, nodes: new Array(GROUP_LENGTH)};
            }

            if (isLast) {
                // Set new value for
                g[node] = {v: value, nodes: new Array(GROUP_LENGTH)};

                if (hasNodes) {
                    for (var i = 0; i < GROUP_LENGTH; i++) {
                        g[node].nodes[i] = nodes[node].nodes[i];
                    }
                }
            }

            base.next = g[node];
            base.nodes = hasNodes ? nodes[node].nodes : false;

            return base;
        }, {
            nodes: inTrie,
            result: [],
            next: null,
            depth: path.length - 1
        }).result;
    };
});
