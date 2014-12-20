require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var timeout = require('../../src/stream/timeout');
var fromArray = require('../../src/stream/fromArray');
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

describe('Stream.timeout', function() {
    beforeEach(function() {
        object = timeout(fromArray([1, 2, 3]));
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
            it('should register onValue', function(done) {
                object.on(args);

                setTimeout(function() {
                    called.should.be.eql(3);
                    withArgs.should.be.eql(3);
                    done();
                }, 10);
            });
            it('should register onValue and stop', function(done) {
                object.on(argsStop);

                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(1);
                    done();
                }, 10);
            });
            it('should call onComplete', function(done) {
                object.on(noop, noop, args);
                setTimeout(function() {
                called.should.be.eql(1);
                    done();
                }, 10);
            });
        });
        describe('failure', function() {
            beforeEach(function() {
                object = timeout(fromCallback(throwError));
                withArgs = [];
                called = 0;
            });

            it('should be muted no onError is registered', function(done) {
                object.on(noop);
                done();
            });
            it('should not call onValue', function(done) {
                object.on(args, noop);

                setTimeout(function() {
                    called.should.be.eql(0);
                    done();
                }, 10);
            });
            it('should call onError', function(done) {
                object.on(noop, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(error);
                    done();
                }, 10);
            });
            it('should call onComplete', function(done) {
                object.on(noop, noop, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    done();
                }, 10);
            });
        });
    });
});
