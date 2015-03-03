require('amdefine/intercept');

var reduce = require('../../src/functional/reduce');

describe('Functional', function() {
    describe('#reduce', function() {
        it('should reduce array to one element using reduction function', function() {
            reduce(['a', 'b', 'c'], function(base, value) {
                return value + base;
            }, '').should.be.eql('cba');
        });
    });
});
