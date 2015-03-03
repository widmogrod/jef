require('amdefine/intercept');

var concat = require('../../src/functional/concat');

describe('Functional', function() {
    describe('#concat', function() {
        it('should concat two arrays', function() {
            concat(['a', 'b'], ['c', 'd']).should.be.eql(['a', 'b', 'c', 'd']);
        });
    });
});
