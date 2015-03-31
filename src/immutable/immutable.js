define([
    './trie/getIn',
    './trie/hasIn',
    './trie/setIn',
    './trie/deleteIn',
    './utils/pathFromKey',
    './utils/keys',
    '../functional/tail',
    '../functional/head',
    '../functional/reduce',
    '../functional/each'
], function(
    getIn,
    hasIn,
    setIn,
    deleteIn,
    pathFromKey,
    keys,
    tail,
    head,
    reduce,
    each
) {
    'use strict';

    /**
     * Ensure everything on start.
     *
     * @returns {Immutable}
     * @constructor
     */
    function Immutable(trie) {
        this._trie = trie;
    }

    Immutable.fromNative = function fromNative() {
        throw new Error('Immutable.fromNative must be implemented by extending object')
    };
    Immutable.nativeType = function nativeType() {
        throw new Error('Immutable.nativeType must be implemented by extending object')
    };

    Immutable.prototype.constructor = Immutable;
    Immutable.prototype.has = function hasInImmutable(key) {
        return hasIn(
            pathFromKey(key),
            this._trie
        );
    };

    Immutable.prototype.get = function getInImmutable(key) {
        return getIn(
            pathFromKey(key),
            this._trie
        );
    };

    Immutable.prototype.set = function setInImmutable(key, value) {
        return new this.constructor(
            setIn(
                pathFromKey(key),
                this._trie,
                key,
                value
            )
        );
    };

    Immutable.prototype.delete = function deleteInImmutable(key) {
        return new this.constructor(
            deleteIn(
                pathFromKey(key),
                this._trie
            )
        );
    };

    Immutable.prototype.keys = function keysInImmutable() {
        return keys(this._trie);
    };

    Immutable.prototype.setIn = function setInPathImmutable(path, value) {
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
    Immutable.prototype.deleteIn = function deleteInPathImmutable(path, value) {
        var first = head(path),
            next = tail(path),
            item = this.get(first);

        return this.delete(
            first,
            path.length > 1
                ? item.deleteIn(next, value)
                : value
        );
    };
    Immutable.prototype.getIn = function getInPathImmutable(path) {
        return reduce(path, function(map, key) {
            return map.get(key);
        }, this);
    };

    Immutable.prototype.forEach = function forEachInImmutable(fn, thisArg) {
        each(this.keys(), function(key) {
            fn.call(thisArg, this.get(key), key);
        }, this);

        return this;
    };
    Immutable.prototype.filter = function filterInImmutable(fn, thisArg) {
        var value, result = this.constructor.nativeType();
        each(this.keys(), function(key) {
            value = this.get(key);
            if (fn.call(thisArg, value, key)) {
                result[key] = value;
            }
        }, this);

        return this.constructor.fromNative(result);
    };
    Immutable.prototype.map = function mapInImmutable(fn, thisArg) {
        var value, result = this.constructor.nativeType();
        each(this.keys(), function(key) {
            value = this.get(key);
            result[key] = fn.call(thisArg, value, key);
        }, this);

        return this.constructor.fromNative(result);
    };

    return Immutable;
});
