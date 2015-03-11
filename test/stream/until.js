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
var until = require('../../src/stream/until');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');

describe('Stream.until', function() {
    'use strict';
    var object, source, breaker;

    beforeEach(function() {
        source = new PushStream();
        breaker = new PushStream();
        breaker = new PushStreamTestProxy(breaker);
        object = until(
            source,
            breaker
        );
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            object.should.be.an.instanceOf(Stream);
        });
    });

    describe('#on', function() {
        beforeEach(function() {
            object = new StreamTestProxy(object);
        });

        describe('success asynchronously', function() {
            it('should register onValue', function(done) {
                object.on(Stubs.onValue);

                setTimeout(function() {
                    source.push(3);

                    object.called.onValue.should.be.eql(1);
                    object.args.onValue.should.be.eql(3);
                    done();
                }, 10)
            });
            it('should register onValue and stop', function(done) {
                object.on(Stubs.onValueAndStop);

                setTimeout(function() {
                    source.push(1);
                    source.push(2);
                    source.push(3);

                    object.called.onValue.should.be.eql(1);
                    object.args.onValue.should.be.eql(1);
                    done();
                }, 10);
            });
            it('should call onComplete', function(done) {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                setTimeout(function() {
                    source.push(3);
                    source.push();

                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 10)
            });
        });

        describe('stop emitting when breaking event is emitted', function() {
            it('should register onValue', function(done) {
                object.on(Stubs.onValue);

                setTimeout(function() {
                    breaker.push(1);
                    source.push(3);

                    breaker.called.onValue.should.be.eql(1);
                    object.called.onValue.should.be.eql(0);
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 10)
            });
            it('should register onValue and stop', function(done) {
                object.on(Stubs.onValueAndStop);

                setTimeout(function() {
                    breaker.push(1);
                    breaker.push(2);
                    breaker.push(3);
                    source.push(1);
                    source.push(2);
                    source.push(3);

                    breaker.called.onValue.should.be.eql(1);
                    object.called.onValue.should.be.eql(0);
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 10);
            });
            it('should call onComplete', function(done) {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                setTimeout(function() {
                    breaker.push();
                    source.push();

                    breaker.called.onValue.should.be.eql(0);
                    breaker.called.onComplete.should.be.eql(1);
                    object.called.onValue.should.be.eql(0);
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 10)
            });
            it('should call onError', function(done) {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                setTimeout(function() {
                    breaker.push(undefined, Stubs.error);
                    source.push(undefined, Stubs.error);

                    breaker.called.onValue.should.be.eql(0);
                    breaker.called.onError.should.be.eql(1);
                    breaker.called.onComplete.should.be.eql(1);

                    object.called.onValue.should.be.eql(0);
                    object.called.onError.should.be.eql(0); // don't care about error, because it's breaker stream
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 10)
            });
        });
    });
});
