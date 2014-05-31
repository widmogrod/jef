var stream = require('../stream.js');
var events = require('../events.js');
var object, context, args;
var callback = function() {};
var params = [1, 2, 'test'];

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
});
