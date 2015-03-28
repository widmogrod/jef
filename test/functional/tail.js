require('amdefine/intercept');

var tail = require('../../src/functional/tail');

describe('Functional#tail', function() {
    it('should return tail of array', function() {
        tail([1, 2, 3]).should.be.eql([2, 3]);
    });
});
