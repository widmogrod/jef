define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './utils/hashToPath',
    './utils/naiveHashFactory',
    './utils/hash',
    '../functional/isTraversable',
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
    isTraversable,
    isArray,
    reduce,
    slice
) {
    'use strict';

    function head(array) {
        return array[0];
    }

    function tail(array) {
        return array.slice(1);
    }

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

        if (isTraversable(data)) {
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

    Map.prototype.setIn = function(path, value) {
        var first = head(path),
            next = tail(path),
            item = this.get(first);

        return this.set(
            first,
            path.length > 1
                ? item.setIn(next, value)
                : value
        );
    };
    Map.prototype.getIn = function(path) {
        return reduce(path, function(map, key) {
            return map.get(key);
        }, this);
    };

    /**
     * Transform values to new form.
     * @returns {Map}
     */
    Map.of = function(data) {
        return new Map(
            arguments.length === 1 && isTraversable(data)
                ? data
                : slice(arguments)
        );
    };

    return Map;
});
