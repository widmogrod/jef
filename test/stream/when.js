require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var WhenStream = require('../../src/stream/when');
var object, streamA, streamB, withArgs, called;
var args = function() {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('WhenStream', function() {
    beforeEach(function() {
        streamA = new Stream();
        streamB = new Stream();
        object = new WhenStream([streamA, streamB]);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of WhenStream', function() {
            object.should.be.an.instanceOf(WhenStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            streamA.push(1);
            called.should.be.eql(0);
            streamB.push(3);
            withArgs.should.be.eql([[1,3]]);
        });
        it('should register onError', function() {
            object.on.error(args);
            called.should.be.eql(0);
            streamA.push.error(1);
            withArgs.should.be.eql([1]);
        });
        it('should register onComplete', function() {
            object.on.complete(args);
            called.should.be.eql(0);
            streamA.push.complete(1);
            withArgs.should.be.eql([]);
        });
    });
});
