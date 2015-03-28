define(['../stream'], function(Stream) {
    'use strict';

    // I know that this is not a stub, but I don't know right now how to name it properly
    var Stubs = {
        onValue: function stubOnValue() {},
        onValueAndStop: function stubOnValueAndStop() {
            return Stream.stop;
        },
        onError: function stubOnError() {},
        onComplete: function stubOnComplete() {},
        addOne: function stubAddOne(value) {
            return value + 1;
        }
    };

    Stubs.thrownError = Stubs.error = new Error('error');
    Stubs.throwError = function throwError() {
        throw Stubs.error;
    };
    Stubs.continueValue = 6;
    Stubs.continueSteamOnError = new Stream(function(sinkValue) {
        sinkValue(Stubs.continueValue);
    });
    Stubs.onErrorAndContinue = function stubOnErrorAndContinue() {
        return Stubs.continueSteamOnError;
    };


    Stubs.arrayWithError = {
        length: 1
    };

    Object.defineProperty(Stubs.arrayWithError, '0', {
        get: function() {
            throw Stream.error;
        }
    });

    return Stubs;
});
