require('amdefine/intercept');

var keys = require('../../src/functional/keys');

describe('Functional#keys', function() {
    it('should return keys of a arrays', function() {
        keys(['a', 'b']).should.be.eql(['0', '1']);
    });
    it('should return keys of a object', function() {
        keys({a: 1, b: 2}).should.be.eql(['a', 'b']);
    });
});
