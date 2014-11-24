define([
    './stream',
    '../functional/each'
], function(Stream, each) {
    'use strict';

    Stream.fromArray = function(array) {
        var result = new Stream();
        setTimeout(function() {
            each(array, result.push.bind(result));
            result.push.complete();
        }, 0);

        return result;
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
