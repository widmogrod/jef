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
     * @returns {List}
     * @constructor
     */
    function List(data, trie) {
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

    /**
     * Transform values to new form.
     * @returns {List}
     */
    List.of = function() {
        return new List(slice(arguments));
    };

    return List;
});
