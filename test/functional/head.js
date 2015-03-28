require('amdefine/intercept');

var head = require('../../src/functional/head');

describe('Functional#head', function() {
    it('should return head of array', function() {
        head([1, 2, 3]).should.be.eql(1);
    });
});
