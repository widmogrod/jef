require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var merge = require('../../src/stream/merge');
var map = require('../../src/stream/map');
var filter = require('../../src/stream/filter');
var noop = require('../../src/functional/noop');
var object, withArgs, called;

var args = function (value) {
    called++;
    withArgs = value;
};
var argsStop = function (value) {
    called++;
    withArgs = value;
    return Stream.stop;
};
var expand = function (value) {
    return fromArray([
        value, -value,
        fromArray([
            value + value
        ])
    ]);
};
var graterThanTwo = function (value) {
    return value > 2;
};
var addOne = function (value) {
    return value + 1;
};

describe('Stream.merge', function () {
    beforeEach(function () {
        object = merge(fromArray([1, 2, 3]), fromArray(['a', 'b', 'c']));
        withArgs = [];
        called = 0;
    });

    describe('#construction', function () {
        it('should construct object instance of Stream', function () {
            object.should.be.an.instanceOf(Stream);
        });
    });
    describe('#on', function () {
        describe('success', function () {
            it('should register onValue', function () {
                object.on(args);
                called.should.be.eql(6);
                withArgs.should.be.eql('c');
            });
            it('should register onValue and stop', function () {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(1);
            });
            it('should call onComplete', function () {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            });
        });
        describe('asynchronously', function () {
            beforeEach(function () {
                object = merge(timeout(fromArray([1, 2, 3])), timeout(fromArray(['a', 'b', 'c'])));
                withArgs = [];
                called = 0;
            });
            it('should register onValue', function (done) {
                object.on(args);
                setTimeout(function () {
                    called.should.be.eql(6);
                    withArgs.should.be.eql('c');
                    done();
                }, 20);
            });
            it('should register onValue and stop', function (done) {
                object.on(argsStop);
                setTimeout(function () {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(1);
                    done();
                }, 20);
            });
            it('should call onComplete', function (done) {
                object.on(noop, noop, args);
                setTimeout(function () {
                    called.should.be.eql(1);
                    done();
                }, 20);
            });
        });
    });

});
