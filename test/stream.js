var stream = require('../stream.js');
var events = require('../events.js');
var object, context, args, next, called;
var callback = function() {};
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
    describe('#merge', function() {
        var streamA, streamB;
        beforeEach(function() {
            streamA = new stream();
            streamB = new stream();
            object = streamA.merge(streamB)
        });

        it('should merge streams', function() {
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
        });
        it('should pipe all values in stream to given function', function() {
            object.pipe(function(v) {
                called++;
                args.push(v);
            });
            called.should.be.eql(3);
            args.should.be.eql(params);
        });
        it('should pipe last value to given function', function() {
            object.pipe(function(v) {
                called++;
                args.push(v);
            }, -1);
            called.should.be.eql(1);
            args.should.be.eql(['test']);
        });
        it('should pipe first value to given function', function() {
            object.pipe(function(v) {
                called++;
                args.push(v);
            }, 0, 1);
            called.should.be.eql(1);
            args.should.be.eql([1]);
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
    describe('flat', function() {
        beforeEach(function() {
            streamA = new stream();
            streamB = new stream();
            object = stream.flat(streamA, streamB);
            called = 0;
        });
        it('should create stream', function() {
            object.should.be.an.instanceOf(stream)
        });
        it('should stream values from flatten streams', function() {
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
    });
});
