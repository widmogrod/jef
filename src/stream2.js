define([
    './stream/stream',
    './stream/map',
    './stream/filter',
    './stream/take',
    './stream/distinct',
    './stream/debounce',
    './stream/when',
    './stream/noop',
    './stream/fromArray',
    './stream/fromPromise'
], function(
    Stream,
    map,
    filter,
    take,
    distinct,
    debounce,
    when,
    noop,
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
    Stream.when = when;
    Stream.noop = noop;

    return Stream;
});
