require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var MapStream = require('../../src/stream/map');
var object, parent, withArgs, called;
var addOne = function(v) {
    return v + 1;
};
var args = function() {
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('MapStream', function() {
    beforeEach(function() {
        parent = new Stream();
        object = new MapStream(parent, addOne);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of MapStream', function() {
            object.should.be.an.instanceOf(MapStream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(0);
            parent.push(1);
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
