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
var when = require('../../src/stream/when');

describe('Stream.when', function() {
    var object;

    beforeEach(function() {
        object = when([
            fromArray([1, 2, 3]),
            fromArray(['a', 'b', 'c'])
        ]);
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        beforeEach(function() {
            object = new StreamTestProxy(object);
        });

        describe('synchronously', function() {
            it('should register onValue', function() {
                object.on(Stubs.onValue);

                object.called.onValue.should.be.eql(3);
                object.args.onValue.should.be.eql([3, 'c']);
            });
            it('should be called on every combination of events', function() {
                object.on(Stubs.onValue);

                object.called.onValue.should.be.eql(3);
                object.allArgs.onValue.should.be.eql([
                    [3, 'a'],
                    [3, 'b'],
                    [3, 'c']
                ]);
            });
            it('should register onValue and stop', function() {
                object.on(Stubs.onValueAndStop);

                object.called.onValue.should.be.eql(1);
                object.args.onValue.should.be.eql([3, 'a']);
            });
            it('should call onComplete', function() {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                object.called.onComplete.should.be.eql(1);
            })
        });

        describe('asynchronously', function() {
            beforeEach(function() {
                var t1 = timeout(fromArray([1, 2, 3]));
                var t2 = timeout(fromArray(['a', 'b', 'c']));

                object = when([
                    t1,
                    t2
                ]);
                object = new StreamTestProxy(object);
            });

            it('should register onValue', function(done) {
                object.on(Stubs.onValue);

                setTimeout(function() {
                    object.called.onValue.should.be.eql(3);
                    object.args.onValue.should.be.eql([3, 'c']);
                    done();
                }, 30);
            });
            it('should be called on every combination of events', function(done) {
                object.on(Stubs.onValue);

                setTimeout(function() {
                    object.called.onValue.should.be.eql(3);
                    object.allArgs.onValue.should.be.eql([
                        [3, 'a'],
                        [3, 'b'],
                        [3, 'c']
                    ]);
                    done();
                }, 10);
            });
            it('should register onValue and stop', function(done) {
                object.on(Stubs.onValueAndStop);

                setTimeout(function() {
                    object.called.onValue.should.be.eql(1);
                    object.args.onValue.should.be.eql([3, 'a']);
                    done();
                }, 10);
            });
            it('should call onComplete', function(done) {
                object.on(Stubs.onValue, Stubs.onError, Stubs.onComplete);
                setTimeout(function() {
                    object.called.onComplete.should.be.eql(1);
                    done();
                }, 10);
            })
        });
    });
});
