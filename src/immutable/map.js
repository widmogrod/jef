define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './trie/deleteIn',
    './utils/pathFromKey',
    './utils/keys',
    '../functional/isObject',
    '../functional/tail',
    '../functional/head',
    '../functional/reduce',
    '../functional/slice',
    '../functional/each'
], function(
    getIn,
    hasIn,
    setIn,
    deleteIn,
    pathFromKey,
    keys,
    isObject,
    tail,
    head,
    reduce,
    slice,
    each
) {
    'use strict';

    /**
     * Ensure everything on start.
     *
     * @param {Array} [trie]    Trie data structure
     * @returns {Map}
     * @constructor
     */
    function Map(trie) {
        this.has = function has_(key) {
            return hasIn(
                pathFromKey(key),
                trie
            );
        };

        this.get = function get_(key) {
            return getIn(
                pathFromKey(key),
                trie
            );
        };

        this.set = function set_(key, value) {
            return new Map(
                setIn(
                    pathFromKey(key),
                    trie,
                    key,
                    value
                )
            );
        };

        this.delete = function delete_(key) {
            return new Map(
                deleteIn(
                    pathFromKey(key),
                    trie
                )
            );
        };

        this.keys = function keys_() {
            return keys(trie);
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

    Map.prototype.forEach = function(fn, thisArg) {
        each(this.keys(), function(key) {
            fn.call(thisArg, this.get(key), key);
        }, this);

        return this;
    };
    Map.prototype.filter = function(fn, thisArg) {
        var value, result = {};
        each(this.keys(), function(key) {
            value = this.get(key);
            if (fn.call(thisArg, value, key)) {
                result[key] = value;
            }
        }, this);

        return Map.fromObject(result);
    };
    Map.prototype.map = function(fn, thisArg) {
        var value, result = {};
        each(this.keys(), function(key) {
            value = this.get(key);
            result[key] = fn.call(thisArg, value, key);
        }, this);

        return Map.fromObject(result);
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
                key,
                deep && isObject(value) && !(value instanceof Map)
                    ? fromObject(value, deep)
                    : value
            );
        }, []));
    };

    return Map;
});
