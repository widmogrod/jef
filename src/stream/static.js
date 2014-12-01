define([
    './stream',
    './sequence',
    './when',
    '../functional/slice'
], function(Stream, SequenceStream, WhenStream, slice) {
    'use strict';

    Stream.when = function() {
        return new WhenStream(slice(arguments));
    };
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
