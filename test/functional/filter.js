require('amdefine/intercept');

var filter = require('../../src/functional/filter');

describe('Functional#filter()', function() {
    it('should return filter array when data and function are passed', function() {
        var result = filter([1, 2, 3], function(item) {
            return item <= 2;
        }, 0);

        result.should.be.Array;
        result.should.be.eql([1, 2]);
    });
    it('should pass to function context', function() {
        var expected, context = {a: 1};

        filter([1, 2, 3], function() { expected = this }, context);

        expected.should.be.exactly(context);
    });
    it('should embrace native implementation', function() {
        var native = false;

        filter({
            filter: function(fn) {
                native = true;
            }
        });

        native.should.be.true;
    });
    it('should iterate manually', function() {
        var called = 0;
        filter({filter: 'f', a: 1, b: 2, c: 3}, function() {
            called++;
        });

        called.should.be.eql(4);
    });
});
