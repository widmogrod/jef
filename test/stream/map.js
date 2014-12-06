require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var map = require('../../src/stream/map');
var object, withArgs, called;

var args = function(value) {
    called++;
    withArgs = value;
};
var argsStop = function(value) {
    called++;
    withArgs = value;
    return Stream.stop;
};
var addOne = function(value) {
    return value + 1;
};

describe('MapStream', function() {
    beforeEach(function() {
        object = map(addOne, fromArray([1, 2, 3]));
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
            // Last arg should be
            withArgs.should.be.eql(4);
        });
        it('should register onValue', function() {
            object.on(argsStop);
            called.should.be.eql(1);
            // Last arg should be
            withArgs.should.be.eql(2);
        });
    });
});
