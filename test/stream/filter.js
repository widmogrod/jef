require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var FilterStream = require('../../src/stream/filter');
var object, parent, withArgs, called;
var gretherThanTwo = function(v) {
    return v > 2;
};
var args = function() {
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('FilterStream', function() {
    beforeEach(function() {
        parent = new Stream();
        object = new FilterStream(parent, gretherThanTwo);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of FilterStream', function() {
            object.should.be.an.instanceOf(FilterStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            parent.push(1);
            withArgs.should.be.eql([]);
            parent.push(3);
            withArgs.should.be.eql([3]);
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
