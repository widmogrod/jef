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
var take = require('../../src/stream/take');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');

describe('Stream.take', function() {
    var object, next;

    beforeEach(function() {
        next = fromArray([1, 2, 3]);
        object = take(next, 2);
        object = new StreamTestProxy(object);
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            take(next, 2).should.be.an.instanceOf(Stream);
        });
    });

    describe('#on', function() {
        describe('success', function() {
            it('should register onValue', function() {
                object.on(Stubs.onValue);
                object.called.onValue.should.be.eql(2);
                object.args.onValue.should.be.eql(2);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop);
                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(1);
            });
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                object.called.onComplete.should.be.eql(1);
            });
        });
    });

    describe('asynchronously', function() {
        beforeEach(function() {
            next = fromArray([1, 2, 3]);
            next = timeout(next);
            object = take(next, 2);
            object = new StreamTestProxy(object);

        });
        it('should register onValue', function(done) {
            object.on(Stubs.onValue);
            setTimeout(function() {
                object.called.onValue.should.be.eql(2);
                object.args.onValue.should.be.eql(2);
                done();
            }, 20);
        });
        it('should register onValue and stop', function(done) {
            object.on(Stubs.onValueAndStop);
            setTimeout(function() {
                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(1);
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
