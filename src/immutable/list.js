define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './utils/hashToPath',
    './utils/naiveHashFactory',
    './utils/hash',
    '../functional/isArray',
    '../functional/reduce'
], function(
    getIn,
    hasIn,
    setIn,
    hashToPath,
    naiveHashFactory,
    hash,
    isArray,
    reduce
) {
    'use strict';

    function pathFromKey(key) {
        return hashToPath(hash(String(key)).toString(2));
    }

    function List(data, trie) {
        if (!(this instanceof List)) {
            return new List(data, trie);
        }

        trie = trie || [];


        if (isArray(data)) {
            trie = reduce(data, function(trie, value, key) {
                return setIn(
                    pathFromKey(key),
                    trie,
                    value
                );
            }, trie);
        }

        this.get = function get(key) {
            return getIn(
                pathFromKey(key),
                trie
            );
        };

        this.set = function set(key, value) {
            return new List(
                null,
                setIn(
                    pathFromKey(key),
                    trie,
                    value
                )
            );
        };
    }

    List.constructor = List;

    return List;
});
