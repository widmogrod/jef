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
        it('should construct object instance of Stream', function() {
            object.should.be.an.instanceOf(Stream);
        });
    });
    describe('#on', function() {
        describe('success', function() {
            it('should register onValue and stop', function(done) {
                object.on(args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    // Last arg should be
                    withArgs.should.be.eql(2);
                    done();
                }, 0);
            });
            it('should call onComplete', function(done) {
                object.on(noop, noop, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    done();
                }, 0);
            });
        });
        describe('failure', function() {
            it('should register onError', function(done) {
                var e = new Error('test');
                var p = Promise.reject(e);
                object = fromPromise(p);
                object.on(noop, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(e);
                    done();
                }, 0);
            });
        });
    });
});
