var stream = require('../stream.js');
var events = require('../events.js');
var object, context, args, next;
var callback = function() {};
var params = [1, 2, 'test'];
var greaterThan3 = function(v) { return v > 3; }

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
});
