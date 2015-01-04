define(['../stream'], function(Stream) {
    'use strict';

    return {
        onValue: function() {
        },
        onValueAndStop: function() {
            return Stream.stop;
        },
        thrownError: new Error('test'),
        throwError: function() {
            throw this.error;
        }
    };
});
