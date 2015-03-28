require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var group = require('../../src/stream/group');
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
var mod = function(value) {
    return value % 2 === 0;
};

describe('Stream.group', function() {
    beforeEach(function() {
        object = group(fromArray([1, 2, 3, 4]), mod);
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
            it('should register onValue', function() {
                object.on(args);
                called.should.be.eql(2);
                withArgs.should.be.eql([2,4]);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql([1, 3]);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            });
        });
        describe('asynchronously', function() {
            beforeEach(function() {
                object = group(timeout(fromArray([1, 2, 3, 4])), mod);
                withArgs = [];
                called = 0;
            });
            it('should register onValue', function(done) {
                object.on(args);
                setTimeout(function() {
                    called.should.be.eql(2);
                    withArgs.should.be.eql([2,4]);
                    done();
                }, 20);
            });
            it('should register onValue and stop', function(done) {
                object.on(argsStop);
                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql([1, 3]);
                    done();
                }, 20);
            });
            it('should call onComplete', function(done) {
                object.on(noop, noop, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    done();
                }, 20);
            });
        });
    });
});
