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
    './stream/log',
    './stream/timeout',
    './stream/fromArray',
    './stream/fromEvent',
    './stream/fromCallback',
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
    log,
    timeout,
    fromArray,
    fromEvent,
    fromCallback,
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
    Stream.prototype.timeout = function(wait) {
        return timeout(this, wait | 0);
    };
    Stream.prototype.log = function(namespace) {
        return log(this, namespace || '');
    };

    Stream.fromArray = fromArray;
    Stream.fromEvent = fromEvent;
    Stream.fromCallback = fromCallback;
    Stream.fromPromise = fromPromise;
    Stream.both = both;
    Stream.when = when;
    Stream.noop = noop;
    Stream.timeout = timeout;

    return Stream;
});
