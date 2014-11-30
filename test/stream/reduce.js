require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var ReduceStream = require('../../src/stream/reduce');
var object, parent, withArgs, called;
var sum = function(v, base) {
    return v + base;
};
var args = function() {
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('ReduceStream', function() {
    beforeEach(function() {
        parent = new Stream();
        object = new ReduceStream(parent, sum, 0);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of ReduceStream', function() {
            object.should.be.an.instanceOf(ReduceStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            parent.push(1);
            withArgs.should.be.eql([1]);
            parent.push(3);
            withArgs.should.be.eql([4]);
        });
        it('should register onError', function() {
            object.on.error(args);
            called.should.be.eql(0);
            parent.push.error(1);
            withArgs.should.be.eql([1]);
        });
        it('should register onComplete', function() {
            object.on.complete(args);
            called.should.be.eql(0);
            parent.push.complete(1);
            withArgs.should.be.eql([]);
        });
    });
});
