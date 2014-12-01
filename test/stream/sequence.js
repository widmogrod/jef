require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var SequenceStream = require('../../src/stream/sequence');
var TakeStream = require('../../src/stream/take');
var object, withArgs, called, data;
var addOne = function(v) {
    return v + 1;
};
var args = function(value) {
    called++;
    withArgs = Array.prototype.slice.call(arguments, 0);
};

describe('Sequence', function() {
    beforeEach(function() {
        data = [1, [2], new String(3)];
        withArgs = [];
        called = 0;
    });
    describe('#construction', function() {
        it('should construct object instane of SequenceStream', function() {
            object = new SequenceStream(data);
            object.should.be.an.instanceOf(SequenceStream);
        })
    });
    describe('#on', function() {
        it('should register onValue and push data asynchronously', function(done) {
            object = new SequenceStream(data);
            object.on(args);
            setImmediate(function() {
                called.should.be.eql(3);
                withArgs.should.be.eql([data[2]]);
                done();
            })
        });
    });
    describe('#take', function() {
        it('should take only first value', function(done) {
            new TakeStream(new SequenceStream(data), 1).on(args);

            setImmediate(function() {
                called.should.be.eql(1);
                withArgs.should.be.eql([data[0]]);
                done();
            });
        });
    });
});
