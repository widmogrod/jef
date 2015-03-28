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

describe('PushStream', function() {
    var object;

    describe('#on', function() {
        beforeEach(function() {
            object = new PushStream();
            object = new PushStreamTestProxy(object);
        });

        describe('success', function() {
            it('should be lazy with initializing stream', function() {
                object.called.on.should.be.eql(0);
            });
            it('should register onValue', function() {
                object.on(Stubs.onValue);
                object.push(1);

                object.called.on.should.be.eql(1);
                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(1);
            });
            it('should register onValue and push more than one value', function() {
                object.on(Stubs.onValue);
                object.push(1);
                object.push(2);

                object.called.on.should.be.eql(1);
                object.called.onValue.should.be.eql(2);
                object.args.onValue.should.be.eql(2);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop);
                object.push(1);
                object.push(2);

                object.called.on.should.be.eql(1);
                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(1);
            });
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                object.push();

                object.called.onComplete.should.be.eql(1);
            });
        });

        describe('failure', function() {

            describe('throw exception in implementation', function() {
                it('should call onError', function() {
                    object.on(Stubs.onValue, Stubs.onError);
                    object.push(undefined, Stubs.error);

                    object.called.on.should.be.eql(1);
                    object.called.onValue.should.be.eql(0);
                    object.called.onError.should.be.eql(1);
                    object.args.onError.should.be.eql(Stubs.thrownError);
                });

                it('should intercept an error and continue', function() {
                    object.on(Stubs.onValue, Stubs.onErrorAndContinue);
                    object.push(undefined, Stubs.error);

                    object.called.on.should.be.eql(1);
                    object.called.onValue.should.be.eql(0);
                    object.called.onError.should.be.eql(1);
                    object.args.onError.should.be.eql(Stubs.error);
                });
            });

            describe('throw exception in onValue callback', function() {
                it('should call onError', function() {
                    try {
                        object.on(Stubs.throwError, Stubs.onError);
                    } catch (e) {
                        e.should.be.eql(Stubs.thrownError);
                    }
                });
            });
        });
    });
});
