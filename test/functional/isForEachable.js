require('amdefine/intercept');

var isForEachable = require('../../src/functional/isForEachable');

describe('Functional#isForEachable', function() {
    it('should return true for all object with forEach function', function() {
        isForEachable([]).should.be.true;
        isForEachable({
            forEach: function() {
            }
        }).should.be.true;
    });
    it('should return false for all object without forEach function', function() {
        isForEachable(1).should.be.false;
        isForEachable({}).should.be.false;
    });
});
