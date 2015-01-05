define(['../stream'], function(Stream) {
    'use strict';

    // I know that this is not a stub, but I don't know right now how to name it properly
    var Stubs = {
        onValue: function() {},
        onValueAndStop: function() {
            return Stream.stop;
        },
        onError: function() {},
        onComplete: function() {},
        thrownError: new Error('test'),
        throwError: function throwError() {
            throw this.error;
        },
        addOne: function(value) {
            return value + 1;
        }
    };

    Stubs.arrayWithError = {
        get 0 () {
            Stubs.throwError();
        }
    };

    return Stubs;
});
