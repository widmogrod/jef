define([
    './stream',
    './take',
    './map',
    './filter',
    './merge',
    './until'
], function(
    Stream,
    TakeStream,
    MapStream,
    FilterStream,
    MergeStream,
    UntilStream
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

    return Stream;
});
