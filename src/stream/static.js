define([
    './stream',
    './sequence'
], function(Stream, SequenceStream) {
    'use strict';

    Stream.fromArray = function(array) {
        return new SequenceStream(array);
    };
    Stream.fromPromise = function(promise) {
        var result = new Stream();

        promise.then(function(value) {
            result.push(value);
            result.push.complete();
        }, function(error) {
            result.push.error(error);
        });

        return result;
    };

    return Stream
});
