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
    describe('#filter', function() {
        beforeEach(function() {
            next = object.filter(greaterThan3);
        });
        it('should create new stream that accepts specific values', function() {
            next.should.be.an.instanceOf(stream)
                .should.not.be.exactly(object);
        });
        it('should receive valid values', function() {
            next.on('value', function(value) {
                args = value;
            })
            object.value(5);
            args.should.be.eql(5);
        })
        it('should not receive invalid values', function() {
            next.on('value', function() {
                args = arguments
            })
            object.value(1);
            args.should.be.empty
                .should.not.be.arguments;
        })
        it('should receive invalid values on out event', function() {
            next.on('out', function(value) {
                args = value
            })
            object.value(1);
            args.should.be.eql(1);
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
        it('should receive maped value', function() {
            next.on('value', function(value) {
                args = value;
            })
            object.value(5);
            args.should.be.eql(666);
        })
        it('should map function', function() {
            next = object.map(addTwo);
            next.on('value', function(value) {
                args = value;
            })
            object.value(2);
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
        it('should trigger "out" event when not all stream have value', function() {
           object.on('out', function() { called = true; });
           streamA.value(1);
           called.should.be.true;
        });
        it('should trigger "value" event when all stream have value', function() {
           object.on('value', function(a, b) { called = true; args = [a, b]});
           streamA.value(1);
           streamB.value(2);
           called.should.be.true;
           args.should.be.eql([1, 2]);
        });
        it('should remove references when destroyed', function() {
            object.on('value', function() {
                called = true;
            });
            object.destroy();
            object.value(2);
            called.should.be.false;
        });
    });
    describe('pipe', function() {
        beforeEach(function() {
            object.value(1);
            object.value(2);
            object.value('test');
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
});
