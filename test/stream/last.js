require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var PushStream = require('../../src/stream/push-stream');
var consume = require('../../src/stream/push-consume');
var fromArray = require('../../src/stream/fromArray');
var fromCallback = require('../../src/stream/fromCallback');
var timeout = require('../../src/stream/timeout');
var last = require('../../src/stream/last');
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

describe('Stream.last', function () {
    beforeEach(function () {
        next = new PushStream(noop, function onDestroy() {
            destroyed = true;
        });
        object = last(next);
        destroyed = false;
        withArgs = [];
        called = 0;
    });

    describe('successful', function () {
        it('should pipe onValue', function () {
            next.push(1);
            object.on(args);
            called.should.be.eql(1);
            withArgs.should.be.eql(1);
            destroyed.should.be.false;
        });
        it('should pipe onValue', function () {
            next.push(1);
            object.on(argsStop);
            next.push(2);
            next.push(3);
            called.should.be.eql(1);
            withArgs.should.be.eql(1);
            destroyed.should.be.false;
        });
    });
    describe('failure', function () {
        beforeEach(function () {
            next = fromCallback(throwError);
            object = last(next);
        });
        it('should pipe onError', function () {
            object.on(noop, args);
            called.should.be.eql(1);
            withArgs.should.be.eql(error);
        });
    });
});
