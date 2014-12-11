require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var reduce = require('../../src/stream/reduce');
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
var sum = function(value, base) {
    return value + base;
};

describe('Stream.reduce', function() {
    beforeEach(function() {
        object = reduce(fromArray([1, 2, 3, 4]), sum, 10);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        describe('success', function() {
            it('should register onValue', function() {
                object.on(args);
                called.should.be.eql(1);
                // Last arg should be
                withArgs.should.be.eql(20);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                // Last arg should be
                withArgs.should.be.eql(20);
            });
        });
    });
});
