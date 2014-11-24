require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var MergeStream = require('../../src/stream/merge');
var object, parentA, parentB, withArgs, called;
var args = function() {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('MergeStream', function() {
    beforeEach(function() {
        parentA = new Stream();
        parentB = new Stream();
        object = new MergeStream(parentA, parentB);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of MergeStream', function() {
            object.should.be.an.instanceOf(MergeStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            parentA.push(1);
            withArgs.should.be.eql([1]);
            parentB.push(2);
            withArgs.should.be.eql([2]);
        });
        it('should register onError', function() {
            object.on.error(args);
            called.should.be.eql(0);
            parentA.push.error(1);
            withArgs.should.be.eql([1]);
            // Stream should be closed
            parentB.push.error(2);
            withArgs.should.be.eql([1]);
        });
        it('should register onComplete', function() {
            object.on.complete(args);
            called.should.be.eql(0);
            parentA.push.complete(1);
            withArgs.should.be.eql([]);
            called.should.be.eql(1);
            // Stream should be closed
            parentB.push.complete(2);
            withArgs.should.be.eql([]);
            called.should.be.eql(1);
        });
    });
});
