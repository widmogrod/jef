require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromCallback = require('../../src/stream/fromCallback');
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
var error = new Error('test');
var throwError = function() {
    throw error;
};

describe('Stream.fromCallback', function() {
    beforeEach(function() {
        object = fromCallback(function() {
            return 2
        });
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
                withArgs.should.be.eql(2);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(2);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            })
        });
        describe('failure', function() {
            beforeEach(function() {
                object = fromCallback(throwError);
                withArgs = [];
                called = 0;
            });

            it('should be muted no onError is registered', function(done) {
                object.on(noop);
                done();
            });
            it('should not call onValue', function() {
                object.on(args, noop);
                called.should.be.eql(0);
            });
            it('should call onError', function() {
                object.on(noop, args);
                called.should.be.eql(1);
                withArgs.should.be.eql(error);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            });
        })
    });
});
