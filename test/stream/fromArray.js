require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var object, withArgs, called;

var args = function() {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
    console.log('a');
    return true;
};

describe('Stream.fromArray', function() {
    beforeEach(function() {
        object = fromArray([1, 2, 3]);
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
            object.on(args).on(function(v) { console.log('called', v) });
            called.should.be.eql(1);
            //withArgs.should.be.eql(1);
        });
    });
});
