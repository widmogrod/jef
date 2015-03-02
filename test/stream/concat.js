require('amdefine/intercept');

/*globals it,describe,beforeEach*/
require('amdefine/intercept');

// Stream implementations
var Stream = require('../../src/stream/stream');
var PushStream = require('../../src/stream/push-stream');
// Test utils
var Stubs = require('../../src/stream/test/stubs');
var StreamTestProxy = require('../../src/stream/test/stream-proxy');
var PushStreamTestProxy = require('../../src/stream/test/push-stream-proxy');
// Helper streams
var fromArray = require('../../src/stream/fromArray');
var timeout = require('../../src/stream/timeout');
var concat = require('../../src/stream/concat');
var map = require('../../src/stream/map');
var log = require('../../src/stream/log');
var filter = require('../../src/stream/filter');
var noop = require('../../src/functional/noop');

var object, next;

var expand = function(value) {
    return fromArray([
        value,
        -value,
        value + value
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
        object = new StreamTestProxy(object);
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            concat(fromArray([])).should.be.an.instanceOf(Stream);
        });
    });
    describe('#on', function() {
        describe('success', function() {
            it('should register onValue', function() {
                object.on(Stubs.onValue);

                object.called.onValue.should.be.eql(9);
                object.args.onValue.should.be.eql(6);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop);

                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(1);
            });
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                object.called.onComplete.should.be.eql(1);
            });
        });
        describe('asynchronously', function() {
            beforeEach(function() {
                object = fromArray([1, 2, 3]);
                object = timeout(object);
                object = map(object, expand);
                object = concat(object);
                object = new StreamTestProxy(object);
            });
            it('should register onValue', function(done) {
                object.on(Stubs.onValue);
                setTimeout(function() {
                    object.called.onValue.should.be.eql(9);
                    object.args.onValue.should.be.eql(6);
                    done();
                }, 20);
            });
            it('should register onValue and stop', function(done) {
                object.on(Stubs.onValueAndStop);
                setTimeout(function() {
                    object.called.onValue.should.be.eql(1);
                    object.args.onValue.should.be.eql(1);
                    done();
                }, 20);
            });
            it('should call onComplete', function(done) {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                setTimeout(function() {
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 20);
            });
        });
    });
    describe('.filter', function() {
        beforeEach(function() {
            object = concat(map(fromArray([1, 2, 3]), expand));
            object = filter(object, graterThanTwo);
            object = new StreamTestProxy(object);
        });
        describe('success', function() {
            it('should register onValue', function() {
                object.on(Stubs.onValue);

                object.called.onValue.should.be.eql(3);
                object.args.onValue.should.be.eql(6);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop);

                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql(4);
            });
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                object.called.onComplete.should.be.eql(1);
            });
        });
        describe('.map', function() {
            beforeEach(function() {
                object = concat(map(fromArray([1, 2, 3]), expand));
                object = map(filter(object, graterThanTwo), addOne);
                object = new StreamTestProxy(object);
            });
            describe('success', function() {
                it('should register onValue', function() {
                    object.on(Stubs.onValue);

                    object.called.onValue.should.be.eql(3);
                    object.args.onValue.should.be.eql(7);
                });
                it('should register onValue and stop', function() {
                    object.on(Stubs.onValueAndStop);

                    object.called.onValue.should.be.eql(1);
                    object.args.onValue.should.be.eql(5);
                });
                it('should call onComplete', function() {
                    object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);

                    object.called.onComplete.should.be.eql(1);
                });
            });
        });
    });

    describe('bugs', function() {
        describe('completes sooner that it should be', function() {
            beforeEach(function() {
                //object = fromArray([
                //    timeout(concat(fromArray(['a', 'A']))),
                //    timeout(concat(fromArray(['b', 'B']))),
                //    timeout(concat(fromArray(['c', 'C'])))
                //]);
                object = fromArray([
                    concat(fromArray([
                        1, 2, fromArray([3, 4])
                    ])),
                    timeout(fromArray([5, 6, 7]))
                ]);
                object = concat(object);
                object = new StreamTestProxy(object);
            });

            it('it completes when last async stream completes', function(done) {
                object.on(Stubs.onValue);

                setTimeout(function() {
                    object.called.onError.should.be.eql(0);
                    object.called.onValue.should.be.eql(7);
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 30);
            });
        });
    });
});
