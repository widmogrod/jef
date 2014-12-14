require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var noop = require('../../src/functional/noop');
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

describe('Stream.fromArray', function() {
    beforeEach(function() {
        object = fromArray([1, 2, 3]);
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
                called.should.be.eql(3);
                // Last arg should be
                withArgs.should.be.eql(3);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                // Last arg should be
                withArgs.should.be.eql(1);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            })
        })
    });
});
