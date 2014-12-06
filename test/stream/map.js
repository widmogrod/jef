require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var map = require('../../src/stream/map');
var object, parent, withArgs, called;

var args = function() {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
};
var addOne = function(value) {
    return value + 1;
};

describe('MapStream', function() {
    beforeEach(function() {
        parent = fromArray([1, 2, 3]);
        object = map(addOne, fromArray);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instane of MapStream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(3);
            withArgs.should.be.eql([4]);
        });
    });
});
