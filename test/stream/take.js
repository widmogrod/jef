require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var take = require('../../src/stream/take');
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

describe('Stream.take', function() {
    beforeEach(function() {
        object = take(2, fromArray([1, 2, 3]));
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instance of MapStream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(2);
            // Last arg should be
            withArgs.should.be.eql(2);
        });
        it('should register onValue', function() {
            object.on(argsStop);
            called.should.be.eql(1);
            // Last arg should be
            withArgs.should.be.eql(1);
        });
    });
});