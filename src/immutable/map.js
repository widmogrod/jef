define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './utils/hashToPath',
    './utils/naiveHashFactory',
    './utils/hash',
    '../functional/isArray',
    '../functional/reduce',
    '../functional/slice'
], function(
    getIn,
    hasIn,
    setIn,
    hashToPath,
    naiveHashFactory,
    hash,
    isArray,
    reduce,
    slice
) {
    'use strict';

    function pathFromKey(key) {
        return hashToPath(hash(String(key)).toString(2));
    }

    /**
     * Ensure everything on start.
     *
     * @param {Array} data      List of elements to initialize
     * @param {Array} [trie]    Trie data structure
     * @returns {Map}
     * @constructor
     */
    function Map(data, trie) {
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
            return new Map(
                null,
                setIn(
                    pathFromKey(key),
                    trie,
                    value
                )
            );
        };
    }

    Map.constructor = Map;

    /**
     * Transform values to new form.
     * @returns {Map}
     */
    Map.of = function() {
        return new Map(slice(arguments));
    };

    return Map;
});
