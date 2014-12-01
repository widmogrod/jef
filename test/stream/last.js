require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var LastStream = require('../../src/stream/last');
var object, parent, withArgs, called;
var args = function() {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('LastStream', function() {
    beforeEach(function() {
        parent = new Stream();
        object = new LastStream(parent);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of LastStream', function() {
            object.should.be.an.instanceOf(LastStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            parent.push(1);
            object.on(args);
            called.should.be.eql(1);
            withArgs.should.be.eql([1]);
            object.on(args);
            called.should.be.eql(2);
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
