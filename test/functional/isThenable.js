require('amdefine/intercept');

var isThenable = require('../../src/functional/isThenable');

describe('Functional#isThenable', function() {
    it('should return true for all object with then funciton', function() {
        isThenable({
            then: function() {}
        }).should.be.true;
    });
    it('should return false for all object without then funciton', function() {
        isThenable(1).should.be.false;
        isThenable({}).should.be.false;
    });
});
