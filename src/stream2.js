define([
    './stream/stream',
    './stream/map',
    './stream/filter',
    './stream/reduce',
    './stream/concat',
    './stream/group',
    './stream/merge',
    './stream/take',
    './stream/skip',
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
    './stream/fromPromise',
    './stream/toArray',
    './stream/push-stream'
], function(
    Stream,
    map,
    filter,
    reduce,
    concat,
    group,
    merge,
    take,
    skip,
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
    fromPromise,
    toArray,
    PushStream
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
    Stream.prototype.concat = function() {
        return concat(this);
    };
    Stream.prototype.group = function(fn) {
        return group(this, fn);
    };
    Stream.prototype.merge = function(stream) {
        return merge(this, stream);
    };
    Stream.prototype.take = function(n) {
        return take(this, n);
    };
    Stream.prototype.skip = function(n) {
        return skip(this, n);
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
    Stream.prototype.toArray = function() {
        return toArray(this);
    };

    // Factories
    Stream.fromArray = fromArray;
    Stream.fromEmitter = fromEmitter;
    Stream.fromCallback = fromCallback;
    Stream.fromPromise = fromPromise;
    Stream.both = both;
    Stream.when = when;
    Stream.noop = noop;
    Stream.merge = merge;
    Stream.timeout = timeout;

    // New classes
    Stream.Push = PushStream;

    return Stream;
});
