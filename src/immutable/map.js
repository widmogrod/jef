define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './utils/hashToPath',
    './utils/naiveHashFactory',
    './utils/hash',
    '../functional/isTraversable',
    '../functional/isObject',
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
    isObject,
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
     * @param {Array} [trie]    Trie data structure
     * @returns {Map}
     * @constructor
     */
    function Map(trie) {
        this.get = function get(key) {
            return getIn(
                pathFromKey(key),
                trie
            );
        };

        this.set = function set(key, value) {
            return new Map(
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
     *
     * Map.of(1, 2, 3) ~ [1, 2, 3]
     * Map.of({a: 1}, {b: 2}) ~ [{a: 1}, {b:2}]
     *
     * @returns {Map}
     */
    Map.of = function mapOf() {
        return Map.fromObject(slice(arguments));
    };

    /**
     * Transform object to immutable map
     *
     * @param {Object} data
     * @param {Boolean} [deep]
     * @returns {Map}
     */
    Map.fromObject = function fromObject(data, deep) {
        return new Map(reduce(data, function(trie, value, key) {
            return setIn(
                pathFromKey(key),
                trie,
                deep && isTraversable(value) && !(value instanceof Map)
                    ? fromObject(value, deep)
                    : value
            );
        }, []));
    };

    return Map;
});
