require('amdefine/intercept');

var isReduceable = require('../../src/functional/isReduceable');

describe('Functional#isReduceable', function() {
    it('should return true for all object with reduce funciton', function() {
        isReduceable([]).should.be.true;
        isReduceable({
            reduce: function() {
            }
        }).should.be.true;
    });
    it('should return false for all object without reduce funciton', function() {
        isReduceable(1).should.be.false;
        isReduceable({}).should.be.false;
    });
});
