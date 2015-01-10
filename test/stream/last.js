/*globals it,describe,beforeEach*/
require('amdefine/intercept');

// Stream implementations
var Stream = require('../../src/stream/stream');
var PushStream = require('../../src/stream/push-stream');
// Test utils
var Stubs = require('../../src/stream/test/stubs');
var StreamTestProxy = require('../../src/stream/test/stream-proxy');
var PushStreamTestProxy = require('../../src/stream/test/push-stream-proxy');
// Helper streams
var fromCallback = require('../../src/stream/fromCallback');
var last = require('../../src/stream/last');
var map = require('../../src/stream/map');
var noop = require('../../src/functional/noop');

describe('Stream.last', function() {
    'use strict';
    var object, next;

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            last(fromCallback(noop)).should.be.an.instanceOf(Stream);
        });
    });
    describe('success', function() {
        beforeEach(function() {
            next = new PushStream();
            next = new PushStreamTestProxy(next);
            object = last(next);
            object = new StreamTestProxy(object);
        });

        it('should prefetch last value', function() {
            next.called.on.should.be.eql(1);
        });
        it('should register onValue', function() {
            next.push(1);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(1);

            object.on(Stubs.onValue);

            next.called.on.should.be.eql(2);
            next.called.onValue.should.be.eql(1);

            object.called.on.should.be.eql(1);
            object.called.onValue.should.be.eql(1);
            object.args.onValue.should.be.eql(1);
        });
        it('should register last value several times', function() {
            next.push(1);

            object.on(Stubs.onValue);
            object.called.onValue.should.be.eql(1);
            object.args.onValue.should.be.eql(1);

            object.on(Stubs.onValue);
            object.called.onValue.should.be.eql(2);
            object.args.onValue.should.be.eql(1);
        });
        it('should register onValue and receive next value', function() {
            next.push(1);

            // Is called because of prefetch
            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(1);

            object.called.onValue.should.be.eql(0);
            object.on(Stubs.onValue);
            object.called.onValue.should.be.eql(1);

            // Now is called second time
            next.called.on.should.be.eql(2);
            next.called.onValue.should.be.eql(1);

            next.push(2);

            next.called.on.should.be.eql(2);
            next.called.onValue.should.be.eql(3);

            object.called.on.should.be.eql(1);
            object.called.onValue.should.be.eql(2);
            object.args.onValue.should.be.eql(2);
        });
        it('should register onValue and stop', function() {
            next.push(1);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(1);

            object.on(Stubs.onValueAndStop);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(1);

            next.push(2);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(2);

            next.push(3);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(3);

            object.called.on.should.be.eql(1);
            object.called.onComplete.should.be.eql(0);
            object.args.onValue.should.be.eql(1);
        });

        describe('.map()', function() {
            var nextPush, nextMap;

            beforeEach(function() {
                nextPush = new PushStream();
                nextPush = new PushStreamTestProxy(nextPush);

                nextMap = map(nextPush, Stubs.addOne);
                nextMap = new StreamTestProxy(nextMap);

                object = last(nextMap);
                object = new StreamTestProxy(object);
            });

            it('should prefetch last value', function() {
                nextPush.called.on.should.be.eql(1);
                nextPush.called.onValue.should.be.eql(0);
                nextMap.called.on.should.be.eql(1);
                nextMap.called.onValue.should.be.eql(0);

                object.called.on.should.be.eql(0);
            });
            it('should register onValue', function() {
                nextPush.push(1);

                nextPush.called.on.should.be.eql(1);
                nextPush.called.onValue.should.be.eql(1);
                nextMap.called.on.should.be.eql(1);
                nextMap.called.onValue.should.be.eql(1);

                object.on(Stubs.onValue);

                object.called.on.should.be.eql(1);
                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(2);

                nextPush.called.on.should.be.eql(1);
                nextPush.called.onValue.should.be.eql(1);
                nextMap.called.on.should.be.eql(2);
                nextMap.called.onValue.should.be.eql(1);

                nextPush.push(2);

                object.called.on.should.be.eql(1);
                object.called.onValue.should.be.eql(2);
                object.args.onValue.should.be.eql(3);

                nextPush.called.on.should.be.eql(1);
                nextPush.called.onValue.should.be.eql(2);
                nextMap.called.on.should.be.eql(2);
                nextMap.called.onValue.should.be.eql(3);
            });
        });
    });

    describe('failure', function() {
        describe('throw exception in consumed stream', function() {
            beforeEach(function() {
                next = fromCallback(Stubs.throwError);
                next = new StreamTestProxy(next);
                object = last(next);
                object = new StreamTestProxy(object);
            });

            it('should call onError', function() {
                // prefetch is done, bot we occur an error
                next.called.on.should.be.eql(1);
                next.called.onError.should.be.eql(1);

                object.on(Stubs.onValue, Stubs.onError);

                // then we forward last error
                next.called.on.should.be.eql(2);
                next.called.onError.should.be.eql(1);

                // assert that object was called with last error
                object.called.on.should.be.eql(1);
                object.called.onError.should.be.eql(1);
                object.args.onError.should.be.eql(Stubs.thrownError);
            });
        });

        describe('throw exception in onValue callback', function() {
            beforeEach(function() {
                next = new PushStream();
                next = new PushStreamTestProxy(next);
                object = last(next);
                object = new StreamTestProxy(object);
            });

            it('should call onError', function() {
                next.push(1);
                // Prefetch done, we have value
                next.called.on.should.be.eql(1);
                next.called.onValue.should.be.eql(1);

                // When handling last value, onValue throws exception
                object.on(Stubs.throwError, Stubs.onError);

                object.called.on.should.be.eql(1);
                object.called.onValue.should.be.eql(1);
                object.called.onError.should.be.eql(1);
                object.args.onError.should.be.eql(Stubs.thrownError);
            });
        });
    });
});
