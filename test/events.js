var events = require('../events.js');
var object;
var callback = function() {};

describe('Events', function() {
    beforeEach(function() {
        object = new events();
    });

    describe('#construction', function(){
        it('should construct object instane of events', function(){
            object.should.be.an.instanceOf(events);
        })
    })
    describe('#on', function() {
        it('should allow to add events', function() {
             object.events.should.be.empty;
             object.on('a', callback);
             object.events.should.have.property('a');
             object.events['a'].should.containEql(callback)
        });
    })
    describe('#off', function() {
        beforeEach(function() {
            object.on('a', callback);
        });

        it('should allow to unregister specific callback for event', function() {
             object.events.should.have.property('a');
             object.events['a'].should.containEql(callback)
             object.off('a', callback);
             object.events['a'].should.be.empty;
        });
        it('should allow to unregister all events for given name', function() {
             object.events.should.have.property('a');
             object.events['a'].should.containEql(callback)
             object.off('a')
             object.events['a'].should.be.empty;
        });

    })
});
