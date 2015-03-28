require('amdefine/intercept');

var isFilterable = require('../../src/functional/isFilterable');

describe('Functional#isFilterable', function() {
    it('should return true for all object with forEach function', function() {
        isFilterable([]).should.be.true;
        isFilterable({
            filter: function() {
            }
        }).should.be.true;
    });
    it('should return false for all object without forEach function', function() {
        isFilterable(1).should.be.false;
        isFilterable({}).should.be.false;
    });
});
