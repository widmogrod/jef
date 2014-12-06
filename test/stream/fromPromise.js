require('amdefine/intercept');

var Promise = require('promise');
var noop = require('../../src/functional/noop');
var Stream = require('../../src/stream/stream');
var fromPromise = require('../../src/stream/fromPromise');
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

describe('Stream.fromPromise', function() {
    beforeEach(function() {
        object = fromPromise(Promise.resolve(2));
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instance of MapStream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        it('should register onError', function(done) {
            var e = new Error('test');
            var p = Promise.reject(e);
            object = fromPromise(p);
            object.on(noop, args);
            setTimeout(function() {
                called.should.be.eql(1);
                withArgs.should.be.eql(e);

                object.on(noop, args);
                setTimeout(function() {
                    called.should.be.eql(2);
                    withArgs.should.be.eql(e);
                    done();
                }, 0);
            }, 0);
        });
        it('should register onValue', function() {
            object.on(args);
            setTimeout(function() {
                called.should.be.eql(1);
                // Last arg should be
                withArgs.should.be.eql(2);
            }, 0);
        });
    });
});
