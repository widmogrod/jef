require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var concat = require('../../src/stream/concat');
var map = require('../../src/stream/map');
var filter = require('../../src/stream/filter');
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
var expand = function(value) {
    return fromArray([
        value, -value,
        fromArray([
            value + value
        ])
    ]);
};
var graterThanTwo = function(value) {
    return value > 2;
};
var addOne = function(value) {
    return value + 1;
};

describe('Stream.concat', function() {
    beforeEach(function() {
        object = concat(map(fromArray([1, 2, 3]), expand));
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
                called.should.be.eql(9);
                withArgs.should.be.eql(6);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(1);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            })
        });
        describe('asynchronously', function() {
            beforeEach(function() {
                object = concat(timeout(map(fromArray([1, 2, 3]), expand)));
                withArgs = [];
                called = 0;
            });
            it('should register onValue', function(done) {
                object.on(args);
                setTimeout(function() {
                    called.should.be.eql(9);
                    withArgs.should.be.eql(6);
                    done();
                }, 20);
            });
            it('should register onValue and stop', function(done) {
                object.on(argsStop);
                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(1);
                    done()
                }, 20);
            });
            it('should call onComplete', function(done) {
                object.on(noop, noop, args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    done()
                }, 20);
            })
        });
    });
    describe('.filter', function() {
        beforeEach(function() {
            object = filter(object, graterThanTwo);
        });
        describe('success', function(){
            it('should register onValue', function() {
                map(object, addOne).on(args);
                called.should.be.eql(3);
                withArgs.should.be.eql(7);
            });
            it('should register onValue and stop', function() {
                map(object, addOne).on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(5);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            });
        });
        describe('.map', function() {
            beforeEach(function() {
                object = map(filter(object, graterThanTwo), addOne);
            });
            describe('success', function() {
                it('should register onValue', function() {
                    map(object, addOne).on(args);
                    called.should.be.eql(3);
                    withArgs.should.be.eql(8);
                });
                it('should register onValue and stop', function() {
                    map(object, addOne).on(argsStop);
                    called.should.be.eql(1);
                    withArgs.should.be.eql(6);
                });
                it('should call onComplete', function() {
                    object.on(noop, noop, args);
                    called.should.be.eql(1);
                });
            });
        })
    })
});
