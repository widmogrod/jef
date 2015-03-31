define([
    '../../functional/each',
    '../../functional/isDefined'
], function(each, isDefined) {
    'use strict';

    return function keys(trie) {
        var result = [];
        for (var v, i = 0, len = trie.length; i < len; i++) {
            v = trie[i];
            if (!v) {
                continue;
            }

            if (isDefined(v.k)) {
                result.push(v.k);
            }

            if (v.nodes) {
                result = result.concat(keys(v.nodes))
            }
        }

        return result;
    };
});