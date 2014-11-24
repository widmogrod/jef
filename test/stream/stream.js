require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var object, withArgs, called;
var inc = function() {
    called++;
};
var args = function() {
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('Stream', function() {
    beforeEach(function() {
        object = new Stream();
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of stream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(inc);
            called.should.be.eql(0);
            object.push(1);
            called.should.be.eql(1);
        });
        it('should register onError', function() {
            object.on(undefined, inc);
            called.should.be.eql(0);
            object.push(undefined, 1);
            called.should.be.eql(1);
        });
        it('should register onComplete', function() {
            object.on(undefined, undefined, inc);
            called.should.be.eql(0);
            object.push(undefined, undefined, 1);
            called.should.be.eql(1);
        });
    });
    describe('#push', function() {
        it('should notified observers on push an value', function() {
            object.on(args);
            withArgs.should.be.eql([]);
            object.push(1);
            withArgs.should.be.eql([1]);
        });
        it('should notified observers on push an error', function() {
            object.on.error(args);
            withArgs.should.be.eql([]);
            object.push.error(1);
            withArgs.should.be.eql([1]);
        });
        it('should notified observers on push a complete', function() {
            object.on.complete(args);
            withArgs.should.be.eql([]);
            object.push.complete(1);
            withArgs.should.be.eql([]);
        });
    });
    describe('#off', function() {
        it('should un register callback on value', function() {
            object.on(args);
            object.off(args);
            object.push(1);
            withArgs.should.be.eql([]);
        });
        it('should un register callback on error', function() {
            object.on.error(args);
            object.off.error(args);
            object.push.error(1);
            withArgs.should.be.eql([]);
        });
        it('should un register callback on complete', function() {
            object.on.complete(args);
            object.off.complete(args);
            object.push.complete(1);
            withArgs.should.be.eql([]);
        });
    });
    describe('#pipe', function() {
        // TODO
    });
});
