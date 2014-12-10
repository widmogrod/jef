require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var concat = require('../../src/stream/concat');
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
var expand = function(value) {
    return fromArray([
        value, -value
        //value + 1,
        //fromArray([-value])
    ]);
};

describe('Stream.concat', function() {
    beforeEach(function() {
        object = concat(map(fromArray([1, 2, 3]), expand));
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        it('should register onValue', function() {
            object.on(args);
            called.should.be.eql(6);
            withArgs.should.be.eql(-3);
        });
        it('should register onValue and stop', function() {
            object.on(argsStop);
            called.should.be.eql(1);
            withArgs.should.be.eql(1);
        });
    });
});
