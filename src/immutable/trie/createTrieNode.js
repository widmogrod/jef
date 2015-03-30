define(['./createTrieNodes'], function(createTrieNodes) {
    'use strict';

    return function createTrieNode(value) {
        return {
            v: value,
            nodes: createTrieNodes()
        };
    }
});