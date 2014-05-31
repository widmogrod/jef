var events = require('../events.js');
var object, context, args;
var callback = function() {};
var params = [1, 2, 'test'];

describe('Events', function() {
    beforeEach(function() {
        object = new events();
        args = [];
        context = null;
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
    describe('#trigger', function() {
        it('should trigger event and callback should be triggered', function(done) {
             object.on('a', done)
             object.trigger('a');
        });
        it('should trigger event and callback should be triggered with arguments', function() {
             object.on('a', function() {
                 args = arguments;
             });
             object.trigger('a', params);
             args.should.be.arguments;
             args.should.be.containEql(params)
        });
        it('should trigger event and callback should be triggered with arguments and context', function() {
             object.on('a', function() {
                 context = this;
             });
             object.trigger('a', params, object);
             context.should.be.exactly(object);
        });
    })
});
