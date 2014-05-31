var stream = require('../stream.js');
var events = require('../events.js');
var object, context, args, next;
var callback = function() {};
var params = [1, 2, 'test'];
var greaterThan3 = function(v) { return v > 3; }
var addTwo = function(v) { return v + 2; }

describe('Stream', function() {
    beforeEach(function() {
        object = new stream();
        args = [];
        context = null;
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
});
