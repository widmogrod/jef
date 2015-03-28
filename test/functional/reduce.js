require('amdefine/intercept');

var reduce = require('../../src/functional/reduce');

describe('Functional#reduce', function() {
    it('should reduce array to one element using reduction function', function() {
        reduce(['a', 'b', 'c'], function(base, value) {
            return value + base;
        }, '').should.be.eql('cba');
    });
    it('should embrace native implementation', function() {
        var native = false;

        reduce({
            reduce: function() {
                native = true;
            }
        });

        native.should.be.true;
    });
    it('should iterate manually', function() {
        var called = 0;
        reduce({reduce: 'r', a: 1, b: 2, c: 3}, function() {
            called++;
        });

        called.should.be.eql(4);
    });
});
