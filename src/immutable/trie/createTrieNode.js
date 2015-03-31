define(['./createTrieNodes'], function(createTrieNodes) {
    'use strict';

    return function createTrieNode(key, value) {
        return {
            v: value,
            k: key,
            nodes: createTrieNodes()
        };
    }
});