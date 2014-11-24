require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var TakeStream = require('../../src/stream/take');
var object, parent, withArgs, called;
var args = function() {
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('TakeStream', function() {
    beforeEach(function() {
        parent = new Stream();
        object = new TakeStream(parent, 2);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of TakeStream', function() {
            object.should.be.an.instanceOf(TakeStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            parent.push(1);
            withArgs.should.be.eql([1]);
            parent.push(2);
            withArgs.should.be.eql([2]);
            parent.push(3);
            withArgs.should.be.eql([2]);
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
