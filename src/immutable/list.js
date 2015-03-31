define([
    './immutable',
    './trie/setIn',
    './utils/pathFromKey',
    '../functional/isArray',
    '../functional/reduce',
    '../functional/slice'
], function(
    Immutable,
    setIn,
    pathFromKey,
    isObject,
    reduce,
    slice
) {
    'use strict';

    /**
     * Ensure everything on start.
     *
     * @param {Array} [trie]    Trie data structure
     * @returns {List}
     * @constructor
     */
    function List(trie) {
        Immutable.call(this, trie);
    }

    List.prototype = Object.create(Immutable.prototype);
    List.prototype.constructor = List;
    List.prototype.push = function pushInList(value) {

    };
    List.prototype.concat = function concatInList(value) {

    };
    List.prototype.unshift = function unshiftInList(value) {

    };
    List.prototype.pop = function popInList(value) {

    };
    List.prototype.shift = function shiftInList(value) {

    };

    /**
     * Transform values to new form.
     *
     * List.of(1, 2, 3) ~ [1, 2, 3]
     * List.of({a: 1}, {b: 2}) ~ [{a: 1}, {b:2}]
     *
     * @returns {List}
     */
    List.of = function mapOf() {
        return List.fromNative(slice(arguments));
    };

    /**
     * Transform object to immutable map
     *
     * @param {Array} data
     * @param {Boolean} [deep]
     * @returns {List}
     */
    List.fromNative = function fromNative(data, deep) {
        return new List(reduce(data, function(trie, value, key) {
            return setIn(
                pathFromKey(key),
                trie,
                key,
                deep && isArray(value) && !(value instanceof List)
                    ? fromNative(value, deep)
                    : value
            );
        }, []));
    };

    List.nativeType = function nativeType() {
        return [];
    };

    return List;
});
