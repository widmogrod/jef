define(['../../functional/reduce'], function(reduce) {
    'use strict';

    return function getIn(path, inTrie, defaults) {
        return reduce(path, function(base, node) {
            var nodes = base.nodes;
            if (nodes && nodes[node]) {
                base.result = nodes[node].v;
                base.nodes = nodes[node].nodes;
            } else {
                base.result = defaults;
                base.nodes = false;
            }

            return base;
        }, {
            nodes: inTrie,
            result: defaults
        }).result;
    };
});
