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
var noop = require('../../src/functional/noop');

describe('Stream.last', function() {
    var object, next;

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            last(fromCallback(noop)).should.be.an.instanceOf(Stream);
        });
    });
    describe('successful', function() {
        beforeEach(function() {
            next = new PushStream(noop);
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
        it('should register onValue and receive next value', function() {
            next.push(1);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(1);

            object.on(Stubs.onValue);

            next.called.on.should.be.eql(2);
            next.called.onValue.should.be.eql(1);

            next.push(2);

            next.called.on.should.be.eql(2);
            next.called.onValue.should.be.eql(2);

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
            next.called.onValue.should.be.eql(1);

            next.push(3);

            next.called.on.should.be.eql(1);
            next.called.onValue.should.be.eql(1);

            object.called.on.should.be.eql(1);
            object.called.onValue.should.be.eql(1);
            object.called.onComplete.should.be.eql(0);
            object.args.onValue.should.be.eql(1);
        });
    });
    describe('failure', function() {
        beforeEach(function() {
            next = fromCallback(Stubs.throwError);
            next = new StreamTestProxy(next);
            object = last(next);
            object = new StreamTestProxy(object);
        });
        it('should pipe onError', function() {
            // prefetch is done, bot we occur an error
            next.called.on.should.be.eql(1);
            next.called.onError.should.be.eql(1);

            object.on(noop, Stubs.onValue);

            // then we forward last error, and not subscribe to next stream
            next.called.on.should.be.eql(1);
            next.called.onError.should.be.eql(1);

            // assert that object was called with last error
            object.called.on.should.be.eql(1);
            object.called.onError.should.be.eql(1);
            object.args.onError.should.be.eql(Stubs.thrownError);
        });
    });
});
