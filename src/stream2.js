define([
    './stream/stream',
    './stream/map',
    './stream/filter',
    './stream/take',
    './stream/distinct',
    './stream/debounce',
    './stream/fromArray',
    './stream/fromPromise'
], function(
    Stream,
    map,
    filter,
    take,
    distinct,
    debounce,
    fromArray,
    fromPromise
) {
    'use strict';

    Stream.prototype.map = function(fn) {
        return map(fn, this);
    };
    Stream.prototype.filter = function(fn) {
        return filter(fn, this);
    };
    Stream.prototype.take = function(n) {
        return take(n, this);
    };
    Stream.prototype.distinct = function() {
        return distinct(this);
    };
    Stream.prototype.debounce = function(timeout) {
        return debounce(timeout, this);
    };

    Stream.fromArray = fromArray;
    Stream.fromPromise = fromPromise;

    return Stream;
});
