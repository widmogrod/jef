require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var PushStream = require('../../src/stream/push-stream');
var consume = require('../../src/stream/push-consume');
var fromArray = require('../../src/stream/fromArray');
var fromCallback = require('../../src/stream/fromCallback');
var timeout = require('../../src/stream/timeout');
var reduce = require('../../src/stream/reduce');
var noop = require('../../src/functional/noop');
var object, next, withArgs, called, destroyed;

var args = function (value) {
    called++;
    withArgs = value;
};
var argsStop = function (value) {
    called++;
    withArgs = value;
    return Stream.stop;
};
var error = new Error('test');
var throwError = function () {
    throw error;
};

describe('consume', function () {
    beforeEach(function () {
        object = new PushStream(function onDestroy() {
            destroyed = true;
        });
        destroyed = false;
        withArgs = [];
        called = 0;
    });

    describe('successful', function () {
        beforeEach(function () {
            next = fromArray([1, 2, 3]);
        });
        it('should pipe onValue', function () {
            object.on(args);
            consume(object, next);
            called.should.be.eql(3);
            withArgs.should.be.eql(3);
            destroyed.should.be.false;
        });

    });
    describe('failure', function () {
        beforeEach(function () {
            next = fromCallback(throwError);
        });
        it('should pipe onError', function () {
            object.on(noop, args);
            consume(object, next);
            called.should.be.eql(1);
            withArgs.should.be.eql(error);
        });
    });
});
