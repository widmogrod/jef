require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var ConcatStream = require('../../src/stream/concat');
var object, parent, withArgs, called;
var args = function() {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('ConcatStream', function() {
    beforeEach(function() {
        parent = new Stream();
        object = new ConcatStream(parent, 2);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of ConcatStream', function() {
            object.should.be.an.instanceOf(ConcatStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            parent.push([1, 2, 3]);
            called.should.be.eql(3);
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
            parent.push.complete([1]);
            withArgs.should.be.eql([]);
        });
    });
});
