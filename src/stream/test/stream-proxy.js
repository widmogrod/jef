define([
    './../stream',
    '../../functional/isFunction'
], function(Stream, isFunction) {
    'use strict';

    /**
     * Create proxy to a stream that collect useful information
     * used during tests
     *
     * @param {Stream} stream
     * @constructor
     */
    return function StreamTestProxy(stream) {
        var called = {
                on: 0,
                onValue: 0,
                onError: 0,
                onComplete: 0
            },
            args = {
                onValue: null,
                onError: null
            },
            allArgs = {
                onValue: [],
                onError: []
            };

        this.on = function onProxy(onValue, onError, onComplete) {
            ++called.on;
            stream.on(function proxyOnValue(value, next) {
                ++called.onValue;
                args.onValue = value;
                allArgs.onValue.push(value);

                if (isFunction(onValue)) {
                    return onValue(value, next);
                }
            }, function proxyOnError(error, next) {
                ++called.onError;
                args.onError = error;
                allArgs.onError.push(error);

                if (isFunction(onError)) {
                    return onError(error, next);
                }
            }, function proxyOnComplete() {
                ++called.onComplete;
                if (isFunction(onComplete)) {
                    onComplete();
                }
            });

            return this;
        };

        this.called = called;
        this.args = args;
        this.allArgs = allArgs;
    };
});
