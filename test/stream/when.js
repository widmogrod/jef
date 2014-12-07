require('amdefine/intercept');

var Stream = require('../../src/stream/stream');
var fromArray = require('../../src/stream/fromArray');
var log = require('../../src/stream/log');
var timeout = require('../../src/stream/timeout');
var when = require('../../src/stream/when');
var object, withArgs, called;

var args = function(value) {
    called++;
    withArgs = value;
};
var argsCollect = function(value) {
    called++;
    withArgs.push(value);
};
var argsStop = function(value) {
    called++;
    withArgs = value;
    return Stream.stop;
};

describe('Stream.when', function() {
    beforeEach(function() {
        object = when([
            fromArray([1, 2, 3]),
            fromArray(['a', 'b', 'c'])
        ]);
        withArgs = [];
        called = 0;
    });

    describe('#construction', function() {
        it('should construct object instance of Stream', function() {
            object.should.be.an.instanceOf(Stream);
        })
    });
    describe('#on', function() {
        describe('synchronously', function() {
            it('should register onValue', function() {
                object.on(args);

                called.should.be.eql(3);
                withArgs.should.be.eql([3, 'c']);
            });
            it('should be called on every combination of events', function() {
                object.on(argsCollect);
                called.should.be.eql(3);
                withArgs.should.be.eql([
                    [3, 'a'],
                    [3, 'b'],
                    [3, 'c']
                ]);
            });
            it('should register onValue and stop', function() {
                object.on(argsStop);

                called.should.be.eql(1);
                withArgs.should.be.eql([3, 'a']);
            });
        });

        describe('asynchronously', function() {
            beforeEach(function() {
                var t1 = timeout(fromArray([1, 2, 3]));
                var t2 = timeout(fromArray(['a', 'b', 'c']));

                //log(t1, 't1');
                //log(t1, 't2');

                object = when([
                    t1,
                    t2
                ]);
                withArgs = [];
                called = 0;
            });

            it('should register onValue', function(done) {
                object.on(args);

                setTimeout(function() {
                    called.should.be.eql(5);
                    withArgs.should.be.eql([3, 'b']);
                    done();
                }, 30);
            });
            it('should be called on every combination of events', function(done) {
                object.on(argsCollect);

                setTimeout(function() {
                    called.should.be.eql(5);
                    withArgs.should.be.eql([
                        [1, 'a'],
                        [2, 'a'],
                        [2, 'a'],
                        [2, 'b'],
                        [3, 'b']
                    ]);
                    done();
                }, 10);
            });
            it('should register onValue and stop', function(done) {
                object
                    //.on(function(v) {console.log('v', v); return Stream.stop})
                    .on(argsStop)

                setTimeout(function() {
                    called.should.be.eql(1);
                    withArgs.should.be.eql([1, 'a']);
                    done();
                }, 10);
            });
        })
    });
});
