define([
    './stream',
    './take',
    './map',
    './filter',
    './reduce',
    './merge',
    './until',
    './concat'
], function(
    Stream,
    TakeStream,
    MapStream,
    FilterStream,
    ReduceStream,
    MergeStream,
    UntilStream,
    ConcatStream
) {
    'use strict';

    Stream.prototype.take = function(take) {
        return new TakeStream(this, take);
    };
    Stream.prototype.map = function(func) {
        return new MapStream(this, func);
    };
    Stream.prototype.filter = function(func) {
        return new FilterStream(this, func);
    };
    Stream.prototype.reduce = function(func, base) {
        return new ReduceStream(this, func, base);
    };
    Stream.prototype.merge = function(stream) {
        return new MergeStream(this, stream);
    };
    Stream.prototype.until = function(stream) {
        return new UntilStream(this, stream);
    };
    Stream.prototype.concat = function() {
        return new ConcatStream(this);
    };

    return Stream;
});
