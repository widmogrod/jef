require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var PushStream = require('../../src/stream/push-stream');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var reduce = require('../../src/stream/reduce');
var noop = require('../../src/functional/noop');
var object, withArgs, called, destroyed;

var args = function (value) {
    called++;
    withArgs = value;
};
var argsStop = function (value) {
    called++;
    withArgs = value;
    return Stream.stop;
};

describe('PushStream', function () {
    beforeEach(function () {
        object = new PushStream(function onDestroy() {
            destroyed = true;
        });
        destroyed = false;
        withArgs = [];
        called = 0;
    });

    describe('#construction', function () {
        it('should construct object instance of Stream', function () {
            object.should.be.an.instanceOf(Stream);
        });
        it('should construct object instance of PushStream', function () {
            object.should.be.an.instanceOf(PushStream);
        });
    });
    describe('#on', function () {
        describe('success', function () {
            it('should register onValue', function () {
                object.on(args);
                object.push(20);
                called.should.be.eql(1);
                withArgs.should.be.eql(20);
                destroyed.should.be.false;
            });
            it('should register onValue and stop', function () {
                object.on(argsStop);
                object.push(20);
                object.push(21);
                called.should.be.eql(1);
                withArgs.should.be.eql(20);
                destroyed.should.be.false;
            });
            it('should call onComplete', function () {
                object.on(noop, noop, args);
                object.push();
                called.should.be.eql(1);
                destroyed.should.be.true;
            });
            it('should call onError', function () {
                var error = new Error('test');
                object.on(noop, args);
                object.push(undefined, error);
                called.should.be.eql(1);
                withArgs.should.be.eql(error);
                destroyed.should.be.true;
            });
            it('should intercept an error and continue', function () {
                var error = new Error('test');
                object.on(args, function (e, next) {
                    return next.push(e), next;
                });
                object.push(undefined, error);
                called.should.be.eql(1);
                withArgs.should.be.eql(error);
                destroyed.should.be.false;
            });
        });
    });
});
