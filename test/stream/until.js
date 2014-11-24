require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var UntilStream = require('../../src/stream/until');
var object, parent, until, withArgs, called;
var args = function() {
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('UntilStream', function() {
    beforeEach(function() {
        parent = new Stream();
        until = new Stream();
        object = new UntilStream(parent, until);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of UntilStream', function() {
            object.should.be.an.instanceOf(UntilStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            parent.push(1);
            withArgs.should.be.eql([1]);
            parent.push(2);
            withArgs.should.be.eql([2]);
        });
        it('should stop stream value if until stream an value', function() {
            object.on(args);
            parent.push(1);
            withArgs.should.be.eql([1]);
            until.push(2);
            parent.push(2);
            withArgs.should.be.eql([1]);
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
