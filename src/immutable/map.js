define([
    './immutable',
    './trie/setIn',
    './utils/pathFromKey',
    '../functional/isObject',
    '../functional/reduce'
], function(
    Immutable,
    setIn,
    pathFromKey,
    isObject,
    reduce
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
        Immutable.call(this, trie);
    }

    Map.prototype = Object.create(Immutable.prototype);
    Map.prototype.constructor = Map;

    /**
     * Transform object to immutable map
     *
     * @param {Object} data
     * @param {Boolean} [deep]
     * @returns {Map}
     */
    Map.fromNative = function fromNative(data, deep) {
        return new Map(reduce(data, function(trie, value, key) {
            return setIn(
                pathFromKey(key),
                trie,
                key,
                deep && isObject(value) && !(value instanceof Map)
                    ? fromNative(value, deep)
                    : value
            );
        }, []));
    };

    Map.nativeType = function nativeType() {
        return {};
    };

    return Map;
});
