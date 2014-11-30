define([
    './stream',
    './take',
    './map',
    './filter',
    './merge',
    './until',
    './concat'
], function(
    Stream,
    TakeStream,
    MapStream,
    FilterStream,
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
