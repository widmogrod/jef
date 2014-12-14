require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var reduce = require('../../src/stream/reduce');
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
var sum = function(value, base) {
    return value + base;
};
var addOne = function(value) {
    return value + 1;
};
var graterThanTwo = function(value) {
    return value > 2;
};

describe('Stream.reduce', function() {
    beforeEach(function() {
        object = reduce(fromArray([1, 2, 3, 4, 2]), sum, 10);
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
                withArgs.should.be.eql(22);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(22);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            })
        });
        describe('asynchronously', function() {
            beforeEach(function() {
                object = reduce(timeout(fromArray([1, 2, 3, 4])), sum, 10);
                withArgs = [];
                called = 0;
            });
            it('should register onValue', function(done) {
                object.on(args);
                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(20);
                    done();
                }, 20);
            });
            it('should register onValue and stop', function(done) {
                object.on(argsStop);
                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql(20);
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
    describe('.map', function() {
        beforeEach(function() {
            object = reduce(map(fromArray([1, 2, 3, 4]), addOne), sum, 10);
        });
        describe('success', function() {
            it('should register onValue', function() {
                object.on(args);
                called.should.be.eql(1);
                withArgs.should.be.eql(24);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(24);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            })
        });
    })
    describe('.filter', function() {
        beforeEach(function() {
            object = fromArray([1, 2, 3, 4, 2]);
            object = filter(object, graterThanTwo);
            object = reduce(object, sum, 10)
        });
        describe('success', function(){
            it('should register onValue', function() {
                object.on(args);
                called.should.be.eql(1);
                withArgs.should.be.eql(3 + 4 + 10);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);
                called.should.be.eql(1);
                withArgs.should.be.eql(3 + 4 + 10);
            });
            it('should call onComplete', function() {
                object.on(noop, noop, args);
                called.should.be.eql(1);
            });
        });
        describe('.map', function() {
            beforeEach(function() {
                object = fromArray([1, 2, 3, 4, 2]);
                object = filter(object, graterThanTwo);
                object = map(object, addOne);
                object = reduce(object, sum, 10)
            });
            describe('success', function() {
                it('should register onValue', function() {
                    object.on(args);
                    called.should.be.eql(1);
                    withArgs.should.be.eql( 3 + 1 + 4 + 1 + 10);
                });
                it('should register onValue and stop', function() {
                    object.on(argsStop);
                    called.should.be.eql(1);
                    withArgs.should.be.eql( 3 + 1 + 4 + 1 + 10);
                });
                it('should call onComplete', function() {
                    object.on(noop, noop, args);
                    called.should.be.eql(1);
                });
            });
        })
    })
});
