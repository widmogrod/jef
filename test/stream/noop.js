require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var noop = require('../../src/stream/noop');
var timeout = require('../../src/stream/timeout');
var noopf = require('../../src/functional/noop');
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

describe('Stream.noop', function() {
    beforeEach(function() {
        object = noop();
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
                called.should.be.eql(0);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(0);
            });
            it('should call onComplete', function() {
                object.on(noopf, noopf, args);
                called.should.be.eql(1);
            })
        });
        describe('asynchronously', function() {
            beforeEach(function() {
                object = noop();
                withArgs = [];
                called = 0;
            });
            it('should register onValue', function(done) {
                object.on(args);
                setTimeout(function() {
                    called.should.be.eql(0);
                    done();
                }, 20);
            });
            it('should register onValue and stop', function(done) {
                object.on(argsStop);
                setTimeout(function() {
                    called.should.be.eql(0);
                    done()
                }, 20);
            });
            it('should call onComplete', function(done) {
                object.on(noopf, noopf, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    done()
                }, 20);
            })
        });
    });
});
