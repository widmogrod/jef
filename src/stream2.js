define([
    './stream/stream',
    './stream/map',
    './stream/filter',
    './stream/take',
    './stream/both',
    './stream/distinct',
    './stream/debounce',
    './stream/when',
    './stream/noop',
    './stream/fromArray',
    './stream/fromEvent',
    './stream/fromPromise'
], function(
    Stream,
    map,
    filter,
    take,
    both,
    distinct,
    debounce,
    when,
    noop,
    fromArray,
    fromEvent,
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
    Stream.fromEvent = fromEvent;
    Stream.fromPromise = fromPromise;
    Stream.both = both;
    Stream.when = when;
    Stream.noop = noop;

    return Stream;
});
