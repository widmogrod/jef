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
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var map = require('../../src/stream/map');

describe('Stream.map', function() {
    'use strict';
    var object, next;

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            map(fromArray([1])).should.be.an.instanceOf(Stream);
        });
    });
    describe('#on', function() {
        beforeEach(function() {
            next = fromArray([1, 2, 3]);
            next = new StreamTestProxy(next);

            object = map(next, Stubs.addOne);
            object = new StreamTestProxy(object);
        });

        describe('success', function() {
            it('should register onValue', function() {
                object.on(Stubs.onValue);

                object.called.onValue.should.be.eql(3);
                object.args.onValue.should.be.eql(4);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop);

                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(2);
            });
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                object.called.onComplete.should.be.eql(1);
            });
        });

        describe('asynchronously', function() {
            beforeEach(function() {
                next = fromArray([1, 2, 3]);
                next = timeout(next);
                next = new StreamTestProxy(next);

                object = map(next, Stubs.addOne);
                object = new StreamTestProxy(object);
            });
            it('should register onValue', function(done) {
                object.on(Stubs.onValue);
                setTimeout(function() {
                    object.called.onValue.should.be.eql(3);
                    object.args.onValue.should.be.eql(4);
                    done();
                }, 20);
            });
            it('should register onValue and stop', function(done) {
                object.on(Stubs.onValueAndStop);
                setTimeout(function() {
                    object.called.onValue.should.be.eql(1);
                    object.args.onValue.should.be.eql(2);
                    done();
                }, 20);
            });
            it('should call onComplete', function(done) {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                setTimeout(function() {
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 20);
            });
        });
    });
});
