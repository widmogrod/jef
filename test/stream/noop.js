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
var noop = require('../../src/stream/noop');

describe('Stream.noop', function() {
    var object;

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            noop().should.be.an.instanceOf(Stream);
        });
    });
    describe('#on', function() {
        beforeEach(function() {
            object = noop();
            object = new StreamTestProxy(object);
        });

        describe('success', function() {
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                object.called.onComplete.should.be.eql(1);
            });
            it('should register onValue', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                object.called.onValue.should.be.eql(0);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop, Stubs.onError, Stubs.onComplete);
                object.called.onValue.should.be.eql(0);
            });
        });
    });
});
