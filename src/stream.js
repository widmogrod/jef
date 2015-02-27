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
    './stream/last',
    './stream/pluck',
    './stream/timeout',
    './stream/fromArray',
    './stream/fromEmitter',
    './stream/fromCallback',
    './stream/fromPromise',
    './stream/fromElement',
    './stream/fromValue',
    './stream/toArray',
    './stream/push-stream',
    './stream/push-consume',
    './stream/dom/toElementProp',
    './stream/domdiff/domDiffWith',
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
    last,
    pluck,
    timeout,
    fromArray,
    fromEmitter,
    fromCallback,
    fromPromise,
    fromElement,
    fromValue,
    toArray,
    PushStream,
    consume,
    toElementProp,
    domDiffWith
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
    Stream.prototype.last = function() {
        return last(this);
    };
    Stream.prototype.toArray = function() {
        return toArray(this);
    };
    Stream.prototype.flatMap = function(fn) {
        return this.map(fn).concat();
    };
    Stream.prototype.pluck = function(pattern) {
        return pluck(this, pattern);
    };
    Stream.prototype.mapApply = function(fn, thisArg) {
        return this.map(function(value) {
            return fn.apply(thisArg, value);
        });
    };
    Stream.prototype.onApply = function(fndomDiffWith, thisArg) {
        return this.on(function(value) {
            return fn.apply(thisArg, value);
        });
    };
    Stream.prototype.onWith = function(stream, fn, thisArg) {
        return this.on(function(valueA) {
            stream.on(function(valueB) {
                fn.call(thisArg, valueA, valueB);
                return Stream.stop;
            });
        });
    };

    // Integrated with other components
    Stream.prototype.domDiffWith = function(elementSelector) {
        return domDiffWith(this, elementSelector);
    };
    Stream.prototype.toElementProp = function(elementSelector, prop) {
        return toElementProp(this, elementSelector, prop);
    };

    // Factories
    Stream.fromArray = fromArray;
    Stream.fromEmitter = fromEmitter;
    Stream.fromCallback = fromCallback;
    Stream.fromPromise = fromPromise;
    Stream.fromElement = fromElement;
    Stream.fromValue = fromValue;
    Stream.both = both;
    Stream.when = when;
    Stream.noop = noop;
    Stream.merge = merge;
    Stream.timeout = timeout;

    // New classes
    Stream.Push = PushStream;
    Stream.Push.prototype.consume = function(stream) {
        return consume(this, stream);
    };

    return Stream;
});
