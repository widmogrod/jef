define([
    './stream/stream',
    './stream/map',
    './stream/filter',
    './stream/reduce',
    './stream/concat',
    './stream/take',
    './stream/latest',
    './stream/both',
    './stream/distinct',
    './stream/debounce',
    './stream/when',
    './stream/noop',
    './stream/log',
    './stream/timeout',
    './stream/fromArray',
    './stream/fromEmitter',
    './stream/fromCallback',
    './stream/fromPromise'
], function(
    Stream,
    map,
    filter,
    reduce,
    concat,
    take,
    latest,
    both,
    distinct,
    debounce,
    when,
    noop,
    log,
    timeout,
    fromArray,
    fromEmitter,
    fromCallback,
    fromPromise
) {
    'use strict';

    Stream.prototype.map = function(fn) {
        return map(this, fn);
    };
    Stream.prototype.filter = function(fn) {
        return filter(this, fn);
    };
    Stream.prototype.reduce = function(fn, base) {
        return reduce(this, fn, base);
    };
    Stream.prototype.concat = function(fn, base) {
        return concat(this);
    };
    Stream.prototype.take = function(n) {
        return take(this, n);
    };
    Stream.prototype.latest = function(n) {
        return latest(this);
    };
    Stream.prototype.distinct = function() {
        return distinct(this);
    };
    Stream.prototype.debounce = function(timeout) {
        return debounce(this, timeout);
    };
    Stream.prototype.timeout = function(wait) {
        return timeout(this, wait | 0);
    };
    Stream.prototype.log = function(namespace) {
        return log(this, namespace || '');
    };

    Stream.fromArray = fromArray;
    Stream.fromEmitter = fromEmitter;
    Stream.fromCallback = fromCallback;
    Stream.fromPromise = fromPromise;
    Stream.both = both;
    Stream.when = when;
    Stream.noop = noop;
    Stream.timeout = timeout;

    return Stream;
});
