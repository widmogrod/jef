var stream = require('../stream.js');
var events = require('../events.js');
var object, context, args, next, called, result;
var callback = function() {};
var callbackInc = function() { called++ };
var params = [1, 2, 'test'];
var greaterThan3 = function(v) { return v > 3; }
var addTwo = function(v) { return v + 2; }

describe('Stream', function() {
    beforeEach(function() {
        object = new stream();
        args = [];
        context = null;
        called = false;
    });

    describe('#construction', function(){
        it('should construct object instane of stream', function(){
            object.should.be.an.instanceOf(stream);
        })
        it('should construct object instane of events', function(){
            object.should.be.an.instanceOf(events);
        })
    })
    describe('#accept', function() {
        beforeEach(function() {
            next = object.accept(greaterThan3);
        });
        it('should create new stream that accepts specific values', function() {
            next.should.be.an.instanceOf(stream)
            .should.not.be.exactly(object);
        });
        it('should receive valid values', function() {
            next.on('data', function(value) {
                args = value;
            })
            object.push(5);
            args.should.be.eql(5);
        })
        it('should not receive invalid values', function() {
            next.on('data', function() {
                args = arguments
            })
            object.push(1);
            args.should.be.empty
            .should.not.be.arguments;
        })
        it('should receive invalid values on out event', function() {
            next.on('out', function(value) {
                args = value
            })
            object.push(1);
            args.should.be.eql(1);
        })
    })
    describe('#reject', function() {
        beforeEach(function() {
            next = object.reject(greaterThan3);
        });
        it('should create new stream that accepts specific values', function() {
            next.should.be.an.instanceOf(stream)
            .should.not.be.exactly(object);
        });
        it('should receive valid values', function() {
            next.on('data', function(value) {
                args = value;
            })
            object.push(2);
            args.should.be.eql(2);
        })
        it('should not receive invalid values', function() {
            next.on('data', function() {
                args = arguments
            })
            object.push(5);
            args.should.be.empty
            .should.not.be.arguments;
        })
        it('should receive invalid values on out event', function() {
            next.on('out', function(value) {
                args = value
            })
            object.push(5);
            args.should.be.eql(5);
        })
    })
    describe('#map', function() {
        beforeEach(function() {
            next = object.map(666);
        });
        it('should create new stream that accepts specific values', function() {
            next.should.be.an.instanceOf(stream)
            .should.not.be.exactly(object);
        });
        it('should receive maped data', function() {
            next.on('data', function(value) {
                args = value;
            })
            object.push(5);
            args.should.be.eql(666);
        })
        it('should map function', function() {
            next = object.map(addTwo);
            next.on('data', function(value) {
                args = value;
            })
            object.push(2);
            args.should.be.eql(4);
        });
    });
    describe('#when', function() {
        var streamA, streamB;
        beforeEach(function() {
            streamA = new stream();
            streamB = new stream();
            object = stream.when(streamA, streamB);
        });

        it('should join streams to on joined stream', function() {
            object.should.be.an.instanceOf(stream);
        });
        it('should trigger "out" event when not all stream have data', function() {
            object.on('out', function() { called = true; });
            streamA.push(1);
            called.should.be.true;
        });
        it('should trigger "data" event when all stream have data', function() {
            object.on('data', function(a, b) { called = true; args = [a, b]});
            streamA.push(1);
            streamB.push(2);
            called.should.be.true;
            args.should.be.eql([1, 2]);
        });
        it('should remove references when destroyed', function() {
            object.on('data', function() {
                called = true;
            });
            object.destroy();
            object.push(2);
            called.should.be.false;
        });
    });
    describe('pipe', function() {
        beforeEach(function() {
            object.push(1);
            object.push(2);
            object.push('test');
            called = 0;
            next = new stream();
            next.on('data', callbackInc)
        });
        it('should not notifie on values since have no reader', function() {
           object.buffer.length.should.be.eql(3);
        });
        it('should pipe all values in stream to next stream', function() {
            object.pipe(next);
            called.should.be.eql(3);
        });
        it('should only accept valid stream objects', function(done) {
            try {
                object.pipe(function() {});
            } catch (e) {
                e.should.be.an.instanceOf(Error);
                done();
            }
        });
    });
    describe('take', function() {
        beforeEach(function() {
            next = object.take(2);
            called = 0;
        });
        it('should create stream', function() {
            next.should.be.an.instanceOf(stream)
            .should.not.be.exactly(object);
        });
        it('schould not take anythign when is not enought data in stream', function() {
            next.on('data', function() {called++});
            next.push(1);
            called.should.be.eql(0)
        });
        it('should take two last item from stream', function() {
            next.on('data', function(a, b) {called++, args = [a, b]});
            object.push(1);
            object.push(2);
            called.should.be.eql(1)
            args.should.be.eql([[1],[2]]);
        });
        it('should take two last item from stream and have more than two items in stream', function() {
            next.on('data', function(a, b) {called++, args = [a, b]});
            object.push(1);
            object.push(2);
            object.push(3);
            called.should.be.eql(2)
            args.should.be.eql([[2],[3]]);
        });
    });
    describe('#merge', function() {
        beforeEach(function() {
            streamA = new stream();
            streamB = new stream();
            object = stream.merge(streamA, streamB);
            called = 0;
        });
        it('should create stream', function() {
            object.should.be.an.instanceOf(stream)
        });
        it('should stream values from merged streams', function() {
            object.on('data', function(value) {
                called++;
                args = [value];
            })
            streamA.push(1);
            called.should.be.eql(1);
            args.should.be.eql([1]);
            streamB.push(2);
            called.should.be.eql(2);
            args.should.be.eql([2]);
        });
        it('should remove references on destroy', function() {
            object.on('data', function(value) {called++;})
            object.destroy();
            streamA.push(1);
            called.should.be.eql(0);
        });
    });
    describe('#reduce', function() {
        describe('to numeric base', function() {
            beforeEach(function() {
                streamA = new stream();
                object = streamA.reduce(function(a, sum) { return a + sum; }, 0);
                called = null;
                object.on('data', function(i) {
                    called = i;
                })
            });
            it('should reduce value', function() {
                object.push(1);
                called.should.be.eql(1);
                object.push(2);
                called.should.be.eql(3);
                object.push(3);
                called.should.be.eql(6);
            });
        });
        describe('to object base', function() {
            it('should reduce to object', function() {
                beforeEach(function() {
                    streamA = new stream();
                    result = {a: 0};
                    object = streamA.reduce(function(a, base) {
                        base.a += a;
                        return base;
                    }, result);
                    object.on('data', function(i) {
                        called = i;
                    })
                });

                it('should aggregate integer values and return updated base object', function() {
                   object.push(1);
                   result.should.be.eql({a: 1});
                   called.should.ne.eql(result);
                   object.push(2);
                   result.should.be.eql({a: 3});
                   called.should.ne.eql(result);
                });
            });
        });
    });
    describe('#fromArray', function() {
       beforeEach(function() {
           object = stream.fromArray([1,2,3]);
           called = [];
       });
       it('should be a stream', function() {
            object.should.be.an.instanceOf(stream);
       });
       it('should have given values', function() {

       });
    });
});
