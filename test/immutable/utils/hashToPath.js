require('amdefine/intercept');

var hashToPath = require('../../../src/immutable/utils/hashToPath');

describe('Immutable#hashToPath', function() {
    it('should retrieve values by its key', function() {
        hashToPath(parseInt('0', 2)).should.be.eql([0]);
        hashToPath(parseInt('1', 2)).should.be.eql([1]);
        hashToPath(parseInt('00', 2)).should.be.eql([0]);
        hashToPath(parseInt('01', 2)).should.be.eql([1]);
        hashToPath(parseInt('10', 2)).should.be.eql([2]);
        hashToPath(parseInt('11', 2)).should.be.eql([3]);
        hashToPath(parseInt('1011', 2)).should.be.eql([3, 2]);
    });
});
