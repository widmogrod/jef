define(['../../functional/reduce'], function(reduce) {
    'use strict';

    return function hasIn(path, inTrie) {
        return reduce(path, function(base, node) {
                return base && base[node] ? base[node].nodes : false;
            }, inTrie) !== false;
    };
});
