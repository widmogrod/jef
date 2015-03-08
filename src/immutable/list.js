define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './utils/hashToPath',
    './utils/naiveHashFactory',
    '../functional/isArray',
    '../functional/reduce'
], function(
    getIn,
    hasIn,
    setIn,
    hashToPath,
    naiveHashFactory,
    isArray,
    reduce
) {
    'use strict';

    function List(data, trie, hash) {
        if (!(this instanceof List)) {
            return new List(data, trie, hash);
        }

        trie = trie || [];
        hash = hash || naiveHashFactory([]);

        this.get = function get(key) {
            return getIn(
                hashToPath(hash(key)),
                trie
            );
        };

        this.set = function set(key, value) {
            return List(
                null,
                setIn(
                    hashToPath(hash(key)),
                    trie,
                    value
                ),
                hash
            );
        };

        if (isArray(data)) {
            trie = reduce(data, function(trie, value, key) {
                return setIn(
                    hashToPath(hash(key)),
                    trie,
                    value
                );
            }, trie);
        }
    }

    List.constructor = List;

    return List;
});
