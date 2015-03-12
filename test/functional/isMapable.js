require('amdefine/intercept');

var isMapable = require('../../src/functional/isMapable');

describe('Functional#isMapable', function() {
    it('should return true for all object with map function', function() {
        isMapable([]).should.be.true;
        isMapable({
            map: function() {
            }
        }).should.be.true;
    });
    it('should return false for all object without map function', function() {
        isMapable(1).should.be.false;
        isMapable({}).should.be.false;
    });
});
